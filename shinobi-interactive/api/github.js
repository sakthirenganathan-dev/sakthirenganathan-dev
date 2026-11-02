// Server-side GitHub API Integration with Caching & Rate-Limit Resilience
// Compatible with Vercel Serverless Functions

const GITHUB_USERNAME = 'sakthirenganathan-dev';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

let memoryCache = {
  data: null,
  timestamp: 0,
};

export default async function handler(req, res) {
  // Set CORS and JSON headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const now = Date.now();
  const isCacheValid = memoryCache.data && now - memoryCache.timestamp < CACHE_TTL_MS;

  if (isCacheValid) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(memoryCache.data);
  }

  try {
    const headers = {
      'User-Agent': 'Shinobi-Developer-Universe',
      Accept: 'application/vnd.github.v3+json',
    };

    // Use optional server-side token if provided in Vercel environment variables (never exposed to client)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`, { headers }),
    ]);

    const rateLimitRemaining = userRes.headers.get('x-ratelimit-remaining');
    const rateLimitReset = userRes.headers.get('x-ratelimit-reset');

    // Handle rate-limiting gracefully
    if (userRes.status === 403 && memoryCache.data) {
      res.setHeader('X-Cache', 'STALE');
      res.setHeader('X-RateLimit-Remaining', rateLimitRemaining || '0');
      return res.status(200).json({
        ...memoryCache.data,
        isStale: true,
        rateLimitResetTime: rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toISOString() : null,
      });
    }

    if (!userRes.ok) {
      throw new Error(`GitHub user API returned ${userRes.status}`);
    }

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];

    // Calculate verified statistics only
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
      .map(([lang, count]) => ({ language: lang, count }));

    const payload = {
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
      source: 'live-github-api',
    };

    memoryCache = {
      data: payload,
      timestamp: now,
    };

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    return res.status(200).json(payload);
  } catch (error) {
    console.error('Server GitHub API Error:', error.message);

    // If cache exists, serve stale data during network failures
    if (memoryCache.data) {
      res.setHeader('X-Cache', 'STALE-FALLBACK');
      return res.status(200).json({
        ...memoryCache.data,
        isStale: true,
        errorNotice: 'Network issue contacting GitHub; serving stale cached data.',
      });
    }

    return res.status(503).json({
      error: 'GitHub API temporarily unavailable',
      message: error.message,
      isStale: false,
    });
  }
}

