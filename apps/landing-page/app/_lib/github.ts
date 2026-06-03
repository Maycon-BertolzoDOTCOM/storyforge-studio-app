import { getStableReleaseMetadata } from './release-metadata';

export interface GithubRepoMeta {
  starsLabel: string;
  versionLabel: string;
}

const REPO_API = 'https://api.github.com/repos/nexu-io/open-design';
const FALLBACK_META: GithubRepoMeta = {
  starsLabel: '40K+',
  versionLabel: 'v0.3.0',
};

let repoMetaPromise: Promise<GithubRepoMeta> | null = null;

function formatStars(count: unknown): string | null {
  if (typeof count !== 'number' || !Number.isFinite(count) || count <= 0) return null;
  if (count < 1000) return String(count);
  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
}

function formatVersion(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object') return null;
  const record = metadata as {
    releaseVersion?: unknown;
    stableVersion?: unknown;
    baseVersion?: unknown;
    versionTag?: unknown;
  };

  const fromVersion = (version: unknown) => {
    if (typeof version !== 'string') return null;
    const match = version.match(/(\d+\.\d+\.\d+(?:[-+][\w.]+)?)/);
    return match ? `v${match[1]}` : null;
  };

  const fromTag = (tag: unknown) => {
    if (typeof tag !== 'string') return null;
    const cleaned = tag.replace(/^open-design[-_]?v?/i, '').trim();
    return cleaned ? `v${cleaned.replace(/^v/, '')}` : null;
  };

  return (
    fromVersion(record.releaseVersion) ??
    fromVersion(record.stableVersion) ??
    fromVersion(record.baseVersion) ??
    fromTag(record.versionTag)
  );
}

async function fetchJson(url: string, headers?: Record<string, string>): Promise<unknown> {
  const response = await fetch(url, {
    headers,
  });
  if (!response.ok) throw new Error(`Request returned ${response.status}: ${url}`);
  return response.json();
}

export function getGithubRepoMeta(): Promise<GithubRepoMeta> {
  repoMetaPromise ??= (async () => {
    const [repoResult, releaseResult] = await Promise.allSettled([
      fetchJson(REPO_API, { Accept: 'application/vnd.github+json' }),
      getStableReleaseMetadata(),
    ]);

    const repo = repoResult.status === 'fulfilled' ? repoResult.value : null;
    const release = releaseResult.status === 'fulfilled' ? releaseResult.value : null;
    const starsLabel = formatStars((repo as { stargazers_count?: unknown } | null)?.stargazers_count);
    const versionLabel = formatVersion(release);

    return {
      starsLabel: starsLabel ?? FALLBACK_META.starsLabel,
      versionLabel: versionLabel ?? FALLBACK_META.versionLabel,
    };
  })();

  return repoMetaPromise;
}
