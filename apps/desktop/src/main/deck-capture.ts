import { BrowserWindow } from "electron";
import type { DesktopRenderSlidesInput, DesktopRenderSlidesResult } from "@open-design/sidecar-proto";

import { waitForPrintableContent } from "./pdf-export.js";

// Deck slides are authored at 1920x1080 (16:9). We render at that logical size
// and let Electron's capturePage emit the display's native pixel scale (2x on
// retina => 3840x2160), so the PNGs are at least FHD and pixel-perfect to the
// browser. This reuses the bundled Electron Chromium — no second headless
// engine, so the packaged app does not grow.
const SLIDE_W = 1920;
const SLIDE_H = 1080;

// Chrome the live deck adds (presenter overlays, the auto-managed progress bar,
// nav hints) must not bleed into a captured slide. Mirrors the print-hide list
// in design-templates/html-ppt/assets/runtime.js.
const HIDE_CHROME_SELECTOR =
  ".progress-bar, .notes-overlay, .overview, .notes, aside.notes, .speaker-notes, .deck-nav, .deck-hint, .deck-counter";

// Real deck slides only. runtime.js clones zero-size `.slide` nodes into
// `.mini-slide` for presenter mode; capturing those would emit blank pages, so
// we scope to direct children of the deck root.
const SLIDE_SELECTOR = ".deck > .slide, body > .slide";

/**
 * Renders an HTML deck to one PNG per slide using a hidden Electron window.
 * The window is shown fully transparent and inactive so the GPU compositor
 * paints it (capturePage needs a live frame) without any visible flash or
 * focus theft, then destroyed.
 */
export async function renderDeckSlides(
  input: DesktopRenderSlidesInput,
): Promise<DesktopRenderSlidesResult> {
  const window = new BrowserWindow({
    width: SLIDE_W,
    height: SLIDE_H,
    useContentSize: true,
    show: false,
    // The deck is 1920x1080. Without this, macOS clamps a window taller than
    // the work area (laptop displays), so the content viewport comes back
    // shorter than 1080 and slides capture at the wrong aspect ratio.
    enableLargerThanScreen: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event) => event.preventDefault());

  try {
    const doc = injectBaseHref(input.html, input.baseHref);
    await window.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(doc)}`);
    await waitForPrintableContent(window);

    // Force the exact content surface so the capture viewport is a true
    // 1920x1080 regardless of the host display size.
    window.setContentSize(SLIDE_W, SLIDE_H);

    // Paint invisibly: opacity 0 before showInactive => compositor renders the
    // page (so capturePage returns real pixels) with zero on-screen flash.
    window.setOpacity(0);
    window.showInactive();

    const count = (await window.webContents.executeJavaScript(
      `(${prepareDeck.toString()})(${JSON.stringify(SLIDE_SELECTOR)}, ${JSON.stringify(HIDE_CHROME_SELECTOR)})`,
      true,
    )) as number;
    if (!Number.isInteger(count) || count < 1) {
      return { ok: false, error: "no slides found in deck" };
    }

    const slides: string[] = [];
    let width = SLIDE_W;
    let height = SLIDE_H;
    for (let i = 0; i < count; i++) {
      await window.webContents.executeJavaScript(
        `(${showSlide.toString()})(${JSON.stringify(SLIDE_SELECTOR)}, ${i})`,
        true,
      );
      // Let the style change + layout settle for two frames before capture.
      await window.webContents.executeJavaScript(
        "new Promise(function(r){requestAnimationFrame(function(){requestAnimationFrame(function(){r(true)})})})",
        true,
      );
      // Clip to the exact 16:9 slide rect (DIP) so the PNG aspect is always
      // correct even if the window content rounds differently.
      const image = await window.webContents.capturePage({ x: 0, y: 0, width: SLIDE_W, height: SLIDE_H });
      const size = image.getSize();
      width = size.width;
      height = size.height;
      slides.push(image.toDataURL());
    }
    return { ok: true, slides, width, height };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  } finally {
    if (!window.isDestroyed()) window.destroy();
  }
}

function injectBaseHref(doc: string, baseHref: string | undefined): string {
  if (!baseHref) return doc;
  const tag = `<base href="${escapeHtmlAttribute(baseHref)}">`;
  if (/<head[^>]*>/i.test(doc)) return doc.replace(/<head[^>]*>/i, (match) => `${match}${tag}`);
  if (/<html[^>]*>/i.test(doc)) return doc.replace(/<html[^>]*>/i, (match) => `${match}<head>${tag}</head>`);
  return `<!doctype html><html><head>${tag}</head><body>${doc}</body></html>`;
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// --- Functions serialized into the page (kept dependency-free) ---

function prepareDeck(slideSelector: string, hideSelector: string): number {
  document.querySelectorAll(hideSelector).forEach((el) => {
    (el as HTMLElement).style.setProperty("display", "none", "important");
  });
  // Pin the deck to an exact 1920x1080 stage so layout is deterministic and
  // independent of the host window's content rounding.
  const style = document.createElement("style");
  style.textContent =
    "html,body{margin:0!important;padding:0!important;width:1920px!important;height:1080px!important;overflow:hidden!important}" +
    ".deck{width:1920px!important;height:1080px!important}";
  document.head.appendChild(style);
  return document.querySelectorAll(slideSelector).length;
}

function showSlide(slideSelector: string, index: number): void {
  const slides = Array.from(document.querySelectorAll(slideSelector));
  slides.forEach((node, k) => {
    const el = node as HTMLElement;
    el.style.transition = "none";
    el.style.animation = "none";
    el.style.opacity = k === index ? "1" : "0";
    el.style.transform = "none";
    el.style.pointerEvents = k === index ? "auto" : "none";
    el.style.zIndex = k === index ? "999" : "0";
  });
}
