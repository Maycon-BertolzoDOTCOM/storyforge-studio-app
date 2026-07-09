import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { ToolPackCache } from "../cache.js";
import type { ToolPackConfig } from "../config.js";
import { processWebSourcemaps } from "../web-sourcemaps.js";
import { ensureWorkspaceBuildArtifacts } from "../workspace-build.js";
import { runPnpm } from "./commands.js";

async function buildWorkspaceArtifacts(config: ToolPackConfig): Promise<void> {
  const webNextEnvPath = join(config.workspaceRoot, "apps", "web", "next-env.d.ts");
  const previousWebNextEnv = await readFile(webNextEnvPath, "utf8").catch(() => null);

  await runPnpm(config, ["--filter", "@storyforge-app/contracts", "build"]);
  await runPnpm(config, ["--filter", "@storyforge-app/registry-protocol", "build"]);
  await runPnpm(config, ["--filter", "@storyforge-app/sidecar-proto", "build"]);
  await runPnpm(config, ["--filter", "@storyforge-app/launcher-proto", "build"]);
  await runPnpm(config, ["--filter", "@storyforge-app/sidecar", "build"]);
  await runPnpm(config, ["--filter", "@storyforge-app/platform", "build"]);
  await runPnpm(config, ["--filter", "@storyforge-app/agui-adapter", "build"]);
  await runPnpm(config, ["--filter", "@storyforge-app/plugin-runtime", "build"]);
  await runPnpm(config, ["--filter", "@storyforge-app/download", "build"]);
  await runPnpm(config, ["--filter", "@storyforge-app/host", "build"]);
  await runPnpm(config, ["--filter", "@storyforge-app/diagnostics", "build"]);
  await runPnpm(config, ["--filter", "@storyforge-app/components", "build"]);
  await runPnpm(config, ["--filter", "@storyforge-app/daemon", "build"]);
  try {
    await runPnpm(config, ["--filter", "@storyforge-app/web", "build"], {
      OD_WEB_OUTPUT_MODE: config.webOutputMode,
    });
    await runPnpm(config, ["--filter", "@storyforge-app/web", "build:sidecar"]);
    // Inject chunk IDs + upload browser sourcemaps to PostHog, then strip
    // .map files. Runs before any packaging step copies the web output into
    // the Electron resources so .map never ends up inside the .app bundle.
    await processWebSourcemaps(config);
  } finally {
    if (previousWebNextEnv == null) {
      await rm(webNextEnvPath, { force: true });
    } else {
      await writeFile(webNextEnvPath, previousWebNextEnv, "utf8");
    }
  }
  await runPnpm(config, ["--filter", "@storyforge-app/desktop", "build"]);
  await runPnpm(config, ["--filter", "@storyforge-app/packaged", "build"]);
}

export async function ensureMacWorkspaceBuild(config: ToolPackConfig, cache: ToolPackCache): Promise<void> {
  await ensureWorkspaceBuildArtifacts(config, cache, async () => {
    await buildWorkspaceArtifacts(config);
  });
}
