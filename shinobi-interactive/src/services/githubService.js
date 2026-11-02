// Client-side GitHub Intelligence Service
// Prioritizes serverless /api/github with direct public REST API fallback

const GITHUB_USERNAME = 'sakthirenganathan-dev';
let clientMemoryCache = null;
let lastFetchTime = 0;
const CLIENT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchShinobiGitHubData(forceRefresh = false) {
  const now = Date.now();

  // Return in-memory cache if still fresh and not force-refreshed
  if (!forceRefresh && clientMemoryCache && now - lastFetchTime < CLIENT_CACHE_DURATION) {
    return {
      ...clientMemoryCache,
      fromClientCache: true,
    };
  }

  // 1. Try serverless endpoint (/api/github) first
  try {
    const serverlessRes = await fetch('/api/github');
    if (serverlessRes.ok) {
      const data = await serverlessRes.json();
      clientMemoryCache = data;
      lastFetchTime = now;
      return {
        ...data,
        fromClientCache: false,
      };
    }
  } catch (err) {
    // Serverless endpoint not present (e.g., standalone local Vite preview) - fallback to direct public REST API
  }

  // 2. Direct public REST API fallback (strictly unauthenticated, no tokens)
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`),
    ]);

    if (!userRes.ok) {
      throw new Error(`GitHub API responded with status ${userRes.status}`);
    }

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];

    let totalStars = 0;
    let totalForks = 0;
    const langCounts = {};

    const verifiedRepos = Array.isArray(repos)
      ? repos.map((r) => {
          totalStars += r.stargazers_count || 0;
          totalForks += r.forks_count || 0;
          if (r.language) {
            langCounts[r.language] = (langCounts[r.language] || 0) + 1;
          }
          return {
            id: r.id,
            name: r.name,
            fullName: r.full_name,
            description: r.description,
            htmlUrl: r.html_url,
            language: r.language,
            stars: r.stargazers_count,
            forks: r.forks_count,
            pushedAt: r.pushed_at,
          };
        })
      : [];

    const topLanguages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([language, count]) => ({ language, count }));

    const result = {
      username: GITHUB_USERNAME,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars,
      totalForks,
      topLanguages,
      recentActivity: verifiedRepos.slice(0, 5),
      lastUpdatedUtc: new Date().toISOString(),
      isStale: false,
      source: 'client-rest-fallback',
      fromClientCache: false,
    };

    clientMemoryCache = result;
    lastFetchTime = now;
    return result;
  } catch (error) {
    console.warn('GitHub Intelligence fetch notice:', error.message);

    // If cache exists from earlier in the session, return stale data with warning
    if (clientMemoryCache) {
      return {
        ...clientMemoryCache,
        isStale: true,
        errorNotice: 'Network rate limit or offline. Showing cached session metrics.',
        fromClientCache: true,
      };
    }

    // Explicit error state - never fabricate numbers
    throw new Error('Unable to retrieve GitHub statistics. Please verify network connection or rate-limits.');
  }
}

