import { chromium, type Browser, type Page } from "playwright";

export interface CloakConfig {
  headless?: boolean;
  proxy?: string;
  userAgent?: string;
  viewport?: { width: number; height: number };
}

export interface VideoInfo {
  id: string;
  title: string;
  url: string;
  duration?: string;
  viewCount?: string;
}

export interface ChannelInfo {
  name: string;
  url: string;
  subscriberCount?: string;
  videoCount?: string;
  videos: VideoInfo[];
}

export class CloakBrowser {
  private browser: Browser | null = null;
  private config: CloakConfig;

  constructor(config: CloakConfig = {}) {
    this.config = {
      headless: true,
      viewport: { width: 1920, height: 1080 },
      ...config,
    };
  }

  async launch(): Promise<Browser> {
    const launchOptions: any = {
      headless: this.config.headless,
      args: [
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    };

    if (this.config.proxy) {
      launchOptions.proxy = {
        server: this.config.proxy,
      };
    }

    this.browser = await chromium.launch(launchOptions);

    // Apply stealth patches
    const context = await this.browser.newContext({
      userAgent:
        this.config.userAgent ||
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      viewport: this.config.viewport,
      locale: "en-US",
      timezoneId: "America/New_York",
    });

    // Anti-detection patches
    await context.addInitScript(() => {
      // Override navigator.webdriver
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });

      // Override chrome.runtime
      (window as any).chrome = {
        runtime: {},
        loadTimes: () => ({}),
        csi: () => ({}),
      };

      // Override permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters: any) =>
        parameters.name === "notifications"
          ? Promise.resolve({ state: Notification.permission } as PermissionStatus)
          : originalQuery(parameters);

      // Override plugins
      Object.defineProperty(navigator, "plugins", {
        get: () => [1, 2, 3, 4, 5],
      });

      // Override languages
      Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en"],
      });
    });

    return this.browser;
  }

  async getChannelInfo(channelUrl: string): Promise<ChannelInfo> {
    const browser = this.browser || (await this.launch());
    const context = browser.contexts()[0];
    const page = await context.newPage();

    try {
      // Navigate to channel
      await page.goto(channelUrl, { waitUntil: "networkidle" });

      // Get channel name
      const name = await page.locator("#channel-name yt-formatted-string").textContent() || "Unknown";

      // Get subscriber count
      const subscriberCount = await page
        .locator("#subscriber-count")
        .textContent()
        .catch(() => undefined);

      // Get video count from videos tab
      await page.click('tp-yt-paper-tab:has-text("Videos")').catch(() => {});
      await page.waitForTimeout(2000);

      const videoCount = await page
        .locator("#videos-count")
        .textContent()
        .catch(() => undefined);

      // Scroll to load videos
      await this.autoScroll(page, 5);

      // Extract video links
      const videos: VideoInfo[] = await page.evaluate(() => {
        const videoElements = document.querySelectorAll("ytd-rich-item-renderer");
        return Array.from(videoElements).map((el) => {
          const titleEl = el.querySelector("#video-title");
          const linkEl = el.querySelector("a#video-title-link, a#thumbnail");
          const durationEl = el.querySelector("ytd-thumbnail-overlay-time-status-renderer span");
          const viewEl = el.querySelector("#metadata-line span:first-child");

          return {
            id: (linkEl as HTMLAnchorElement)?.href?.match(/v=([^&]+)/)?.[1] || "",
            title: titleEl?.textContent?.trim() || "",
            url: (linkEl as HTMLAnchorElement)?.href || "",
            duration: durationEl?.textContent?.trim() || undefined,
            viewCount: viewEl?.textContent?.trim() || undefined,
          };
        });
      });

      return {
        name: name.trim(),
        url: channelUrl,
        subscriberCount: subscriberCount?.trim(),
        videoCount: videoCount?.trim(),
        videos,
      };
    } finally {
      await page.close();
    }
  }

  async getVideoTranscript(videoUrl: string): Promise<string | null> {
    const browser = this.browser || (await this.launch());
    const context = browser.contexts()[0];
    const page = await context.newPage();

    try {
      await page.goto(videoUrl, { waitUntil: "networkidle" });

      // Click "Show transcript" button
      await page.click("#expand").catch(() => {});
      await page.waitForTimeout(1000);

      // Click "...more" to expand description
      await page
        .click('tp-yt-paper-button#expand')
        .catch(() => {});

      // Click "Show transcript" if available
      await page
        .click('button:has-text("Show transcript")')
        .catch(() => {});

      await page.waitForTimeout(2000);

      // Extract transcript
      const transcript = await page.evaluate(() => {
        const segments = document.querySelectorAll("ytd-transcript-segment-renderer");
        return Array.from(segments)
          .map((el) => el.querySelector(".segment-text")?.textContent?.trim() || "")
          .filter(Boolean)
          .join("\n");
      });

      return transcript || null;
    } finally {
      await page.close();
    }
  }

  async searchVideos(query: string, maxResults: number = 10): Promise<VideoInfo[]> {
    const browser = this.browser || (await this.launch());
    const context = browser.contexts()[0];
    const page = await context.newPage();

    try {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      await page.goto(searchUrl, { waitUntil: "networkidle" });

      // Scroll to load more results
      await this.autoScroll(page, 3);

      // Extract search results
      const videos: VideoInfo[] = await page.evaluate(() => {
        const results = document.querySelectorAll("ytd-video-renderer");
        return Array.from(results).map((el) => {
          const titleEl = el.querySelector("#video-title");
          const linkEl = el.querySelector("a#video-title");
          const durationEl = el.querySelector("ytd-thumbnail-overlay-time-status-renderer span");
          const viewEl = el.querySelector("#metadata-line span:first-child");

          return {
            id: (linkEl as HTMLAnchorElement)?.href?.match(/v=([^&]+)/)?.[1] || "",
            title: titleEl?.textContent?.trim() || "",
            url: (linkEl as HTMLAnchorElement)?.href || "",
            duration: durationEl?.textContent?.trim() || undefined,
            viewCount: viewEl?.textContent?.trim() || undefined,
          };
        });
      });

      return videos.slice(0, maxResults);
    } finally {
      await page.close();
    }
  }

  private async autoScroll(page: Page, times: number): Promise<void> {
    for (let i = 0; i < times; i++) {
      await page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
      });
      await page.waitForTimeout(1500);
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
