export const PRODUCT_NAME = "StoryForge";
export const DESKTOP_LOG_ECHO_ENV = "OD_DESKTOP_LOG_ECHO";
export const WEB_STANDALONE_HOOK_CONFIG_ENV = "OD_TOOLS_PACK_WEB_STANDALONE_HOOK_CONFIG";
export const WEB_STANDALONE_RESOURCE_NAME = "storyforge-web-standalone";
export const ELECTRON_BUILDER_ASAR = false;
export const ELECTRON_BUILDER_BUILD_DEPENDENCIES_FROM_SOURCE = false;
export const ELECTRON_BUILDER_NODE_GYP_REBUILD = false;
export const ELECTRON_BUILDER_NPM_REBUILD = false;
export const ELECTRON_REBUILD_MODE = "sequential" as const;
export const ELECTRON_REBUILD_NATIVE_MODULES = ["better-sqlite3"] as const;
export const ELECTRON_BUILDER_FILE_PATTERNS = [
  "**/*",
  "!**/node_modules/.bin",
  "!**/node_modules/electron{,/**/*}",
  "!**/*.map",
  "!**/*.tsbuildinfo",
  "!**/.next/cache",
  "!**/.next/cache/**",
  "!**/node_modules/better-sqlite3/build/Release/obj",
  "!**/node_modules/better-sqlite3/build/Release/obj/**",
  "!**/node_modules/better-sqlite3/deps",
  "!**/node_modules/better-sqlite3/deps/**",
] as const;
export const NSIS_INSTALLER_LANGUAGE_BY_WEB_LOCALE = {
  en: "en_US",
  fa: "fa_IR",
  "pt-BR": "pt_BR",
  ru: "ru_RU",
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
} as const;
export const INTERNAL_PACKAGES = [
  { directory: "packages/release", name: "@storyforge-app/release" },
  { directory: "packages/components", name: "@storyforge-app/components" },
  { directory: "packages/contracts", name: "@storyforge-app/contracts" },
  { directory: "packages/registry-protocol", name: "@storyforge-app/registry-protocol" },
  { directory: "packages/sidecar-proto", name: "@storyforge-app/sidecar-proto" },
  { directory: "packages/launcher-proto", name: "@storyforge-app/launcher-proto" },
  { directory: "packages/sidecar", name: "@storyforge-app/sidecar" },
  { directory: "packages/platform", name: "@storyforge-app/platform" },
  { directory: "packages/download", name: "@storyforge-app/download" },
  { directory: "packages/host", name: "@storyforge-app/host" },
  { directory: "packages/agui-adapter", name: "@storyforge-app/agui-adapter" },
  { directory: "packages/plugin-runtime", name: "@storyforge-app/plugin-runtime" },
  { directory: "packages/diagnostics", name: "@storyforge-app/diagnostics" },
  { directory: "apps/daemon", name: "@storyforge-app/daemon" },
  { directory: "apps/web", name: "@storyforge-app/web" },
  { directory: "apps/desktop", name: "@storyforge-app/desktop" },
  { directory: "apps/packaged", name: "@storyforge-app/packaged" },
] as const;
