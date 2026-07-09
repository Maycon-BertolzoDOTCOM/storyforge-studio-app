import {
  releaseChannelFromNamespace,
  releaseChannelFromVersion,
  releaseInstallIdentity,
} from "@storyforge-app/release";

const DEFAULT_WINDOW_TITLE = "StoryForge";

export function resolvePackagedWindowTitle(config: { appVersion: string | null; namespace: string }): string {
  const channel =
    releaseChannelFromVersion(config.appVersion) ??
    releaseChannelFromNamespace(config.namespace);
  return channel == null ? DEFAULT_WINDOW_TITLE : releaseInstallIdentity(channel).productName;
}
