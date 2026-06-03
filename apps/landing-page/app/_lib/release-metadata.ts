export const RELEASE_METADATA_URL = 'https://releases.open-design.ai/stable/latest/metadata.json';

let stableReleaseMetadataPromise: Promise<unknown | null> | null = null;

export function getStableReleaseMetadata(): Promise<unknown | null> {
  stableReleaseMetadataPromise ??= (async () => {
    try {
      const response = await fetch(RELEASE_METADATA_URL, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  })();

  return stableReleaseMetadataPromise;
}
