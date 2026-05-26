export interface GithubRepoMeta {
  starsLabel: string;
  versionLabel: string;
}

export interface ContributorRanking {
  login: string;
  htmlUrl: string;
  avatarUrl: string;
  count: number;
}

export interface GoodFirstIssue {
  number: number;
  title: string;
  htmlUrl: string;
  labels: string[];
  createdAt: string;
}

export interface CardEvent {
  eventId: string;
  recipient: string;
  tierKey: string;
  tierName: string;
  cardUrl: string;
  commentUrl: string;
  shareUrl: string;
  createdAt: string;
}

const REPO_API = 'https://api.github.com/repos/nexu-io/open-design';
const SEARCH_API = 'https://api.github.com/search/issues';
const CARD_EVENTS_URL =
  'https://raw.githubusercontent.com/nexu-io/open-design/bot-cards/data/card-events.jsonl';
const FALLBACK_META: GithubRepoMeta = {
  starsLabel: '40K+',
  versionLabel: 'v0.3.0',
};

let repoMetaPromise: Promise<GithubRepoMeta> | null = null;
let topContributorsPromise: Promise<ContributorRanking[]> | null = null;
let goodFirstIssuesPromise: Promise<GoodFirstIssue[]> | null = null;
let cardEventsPromise: Promise<CardEvent[]> | null = null;

function formatStars(count: unknown): string | null {
  if (typeof count !== 'number' || !Number.isFinite(count) || count <= 0) return null;
  if (count < 1000) return String(count);
  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
}

function formatVersion(release: unknown): string | null {
  if (!release || typeof release !== 'object') return null;
  const record = release as { name?: unknown; tag_name?: unknown };

  const fromName = (name: unknown) => {
    if (typeof name !== 'string') return null;
    const match = name.match(/(\d+\.\d+\.\d+(?:[-+][\w.]+)?)/);
    return match ? `v${match[1]}` : null;
  };

  const fromTag = (tag: unknown) => {
    if (typeof tag !== 'string') return null;
    const cleaned = tag.replace(/^open-design[-_]?v?/i, '').trim();
    return cleaned ? `v${cleaned.replace(/^v/, '')}` : null;
  };

  return fromName(record.name) ?? fromTag(record.tag_name);
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
  return response.json();
}

export function getGithubRepoMeta(): Promise<GithubRepoMeta> {
  repoMetaPromise ??= (async () => {
    const [repoResult, releaseResult] = await Promise.allSettled([
      fetchJson(REPO_API),
      fetchJson(`${REPO_API}/releases/latest`),
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

function isoDaysAgo(days: number): string {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

export function getTopContributorsLastWeek(limit = 10): Promise<ContributorRanking[]> {
  topContributorsPromise ??= (async () => {
    const since = isoDaysAgo(7);
    const q = encodeURIComponent(
      `repo:nexu-io/open-design is:pr is:merged merged:>=${since}`,
    );
    const counts = new Map<string, ContributorRanking>();
    for (let page = 1; page <= 4; page += 1) {
      const url = `${SEARCH_API}?q=${q}&per_page=100&page=${page}`;
      let payload: unknown;
      try {
        payload = await fetchJson(url);
      } catch {
        break;
      }
      const items = (payload as { items?: unknown[] } | null)?.items;
      if (!Array.isArray(items) || items.length === 0) break;
      for (const item of items) {
        const u = (item as { user?: { login?: unknown; html_url?: unknown; avatar_url?: unknown; type?: unknown } }).user;
        const login = typeof u?.login === 'string' ? u.login : null;
        if (!login) continue;
        if (u?.type === 'Bot' || /\bbot\b/i.test(login)) continue;
        const existing = counts.get(login);
        if (existing) {
          existing.count += 1;
        } else {
          counts.set(login, {
            login,
            htmlUrl: typeof u?.html_url === 'string' ? u.html_url : `https://github.com/${login}`,
            avatarUrl: typeof u?.avatar_url === 'string' ? u.avatar_url : `https://avatars.githubusercontent.com/${login}`,
            count: 1,
          });
        }
      }
      if (items.length < 100) break;
    }
    return [...counts.values()]
      .sort((a, b) => (b.count - a.count) || a.login.localeCompare(b.login))
      .slice(0, limit);
  })();

  return topContributorsPromise;
}

export function getOpenGoodFirstIssues(limit = 8): Promise<GoodFirstIssue[]> {
  goodFirstIssuesPromise ??= (async () => {
    const q = encodeURIComponent(
      'repo:nexu-io/open-design is:issue is:open label:"good first issue"',
    );
    const url = `${SEARCH_API}?q=${q}&per_page=${Math.max(limit, 8)}&sort=created&order=desc`;
    let payload: unknown;
    try {
      payload = await fetchJson(url);
    } catch {
      return [];
    }
    const items = (payload as { items?: unknown[] } | null)?.items;
    if (!Array.isArray(items)) return [];
    return items
      .map((item) => {
        const r = item as {
          number?: unknown;
          title?: unknown;
          html_url?: unknown;
          created_at?: unknown;
          labels?: { name?: unknown }[];
          pull_request?: unknown;
        };
        if (r.pull_request) return null;
        const number = typeof r.number === 'number' ? r.number : null;
        const title = typeof r.title === 'string' ? r.title : null;
        const htmlUrl = typeof r.html_url === 'string' ? r.html_url : null;
        const createdAt = typeof r.created_at === 'string' ? r.created_at : null;
        if (number == null || !title || !htmlUrl || !createdAt) return null;
        const labels = Array.isArray(r.labels)
          ? r.labels.map((l) => (typeof l?.name === 'string' ? l.name : null)).filter((x): x is string => !!x)
          : [];
        return { number, title, htmlUrl, labels, createdAt };
      })
      .filter((x): x is GoodFirstIssue => !!x)
      .slice(0, limit);
  })();

  return goodFirstIssuesPromise;
}

export function getCardEvents(): Promise<CardEvent[]> {
  cardEventsPromise ??= (async () => {
    let text = '';
    try {
      const res = await fetch(CARD_EVENTS_URL);
      if (!res.ok) return [];
      text = await res.text();
    } catch {
      return [];
    }
    const events: CardEvent[] = [];
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const parsed = JSON.parse(trimmed) as Partial<CardEvent>;
        if (
          typeof parsed.eventId === 'string' &&
          typeof parsed.recipient === 'string' &&
          typeof parsed.tierKey === 'string' &&
          typeof parsed.tierName === 'string' &&
          typeof parsed.cardUrl === 'string' &&
          typeof parsed.commentUrl === 'string' &&
          typeof parsed.createdAt === 'string'
        ) {
          events.push({
            eventId: parsed.eventId,
            recipient: parsed.recipient,
            tierKey: parsed.tierKey,
            tierName: parsed.tierName,
            cardUrl: parsed.cardUrl,
            commentUrl: parsed.commentUrl,
            shareUrl: typeof parsed.shareUrl === 'string' ? parsed.shareUrl : '',
            createdAt: parsed.createdAt,
          });
        }
      } catch {
        // ignore malformed lines
      }
    }
    events.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return events;
  })();

  return cardEventsPromise;
}
