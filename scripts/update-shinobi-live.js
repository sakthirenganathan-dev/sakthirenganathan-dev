import fs from 'fs';
import path from 'path';

export const USERNAME = 'sakthirenganathan-dev';
export const CACHE_FILE = path.resolve('assets', 'telemetry-cache.json');
export const OUTPUT_SVG = path.resolve('assets', 'id-dashboard.svg');
export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

/**
 * Checks if two YYYY-MM-DD date strings represent consecutive calendar days.
 */
export function isConsecutiveDay(prevDateStr, currDateStr) {
  if (!prevDateStr || !currDateStr) return false;
  const prev = new Date(prevDateStr + 'T00:00:00Z');
  const curr = new Date(currDateStr + 'T00:00:00Z');
  const diffMs = curr.getTime() - prev.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

/**
 * Calculates accurate streak and contribution totals from GitHub contribution calendar days.
 * @param {object} calendar - GitHub GraphQL contributionCalendar object
 * @param {string} timezone - Timezone identifier (e.g. 'Asia/Kolkata' or 'UTC')
 * @returns {object|null} Computed contribution metrics
 */
export function calculateContributionMetrics(calendar, timezone = DEFAULT_TIMEZONE) {
  if (!calendar || !Array.isArray(calendar.weeks)) {
    return null;
  }

  const days = [];
  for (const week of calendar.weeks) {
    if (Array.isArray(week.contributionDays)) {
      for (const day of week.contributionDays) {
        if (day && day.date) {
          days.push({
            date: day.date,
            count: Number.isInteger(day.contributionCount) ? day.contributionCount : 0,
          });
        }
      }
    }
  }

  if (days.length === 0) {
    return null;
  }

  // Sort ascending by chronological date
  days.sort((a, b) => a.date.localeCompare(b.date));

  const dataRangeStart = days[0].date;
  const dataRangeEnd = days[days.length - 1].date;

  const totalContributions = typeof calendar.totalContributions === 'number'
    ? calendar.totalContributions
    : days.reduce((acc, d) => acc + d.count, 0);

  // 1. Longest Streak calculation
  let longestStreak = 0;
  let currentRun = 0;
  let runStart = null;
  let longestStreakStart = null;
  let longestStreakEnd = null;

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const prevDay = i > 0 ? days[i - 1] : null;

    if (day.count > 0) {
      if (currentRun === 0 || !isConsecutiveDay(prevDay?.date, day.date)) {
        currentRun = 1;
        runStart = day.date;
      } else {
        currentRun++;
      }

      if (currentRun > longestStreak) {
        longestStreak = currentRun;
        longestStreakStart = runStart;
        longestStreakEnd = day.date;
      }
    } else {
      currentRun = 0;
      runStart = null;
    }
  }

  // 2. Current Streak calculation with explicit timezone awareness
  const now = new Date();
  const localDateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const todayStr = localDateFormatter.format(now);

  let todayIndex = days.findIndex((d) => d.date === todayStr);
  if (todayIndex === -1) {
    todayIndex = days.length - 1;
  }

  const todayEntry = days[todayIndex];
  let currentStreak = 0;

  if (todayEntry && todayEntry.count > 0) {
    currentStreak = 1;
    for (let i = todayIndex; i > 0; i--) {
      if (isConsecutiveDay(days[i - 1].date, days[i].date) && days[i - 1].count > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    // Today has 0 contributions so far: check if yesterday was active
    const yesterdayIndex = todayIndex - 1;
    if (
      yesterdayIndex >= 0 &&
      days[yesterdayIndex].count > 0 &&
      isConsecutiveDay(days[yesterdayIndex].date, todayEntry?.date)
    ) {
      currentStreak = 1;
      for (let i = yesterdayIndex; i > 0; i--) {
        if (isConsecutiveDay(days[i - 1].date, days[i].date) && days[i - 1].count > 0) {
          currentStreak++;
        } else {
          break;
        }
      }
    } else {
      currentStreak = 0;
    }
  }

  return {
    totalContributions,
    currentStreak,
    longestStreak,
    longestStreakStart,
    longestStreakEnd,
    dataRangeStart,
    dataRangeEnd,
  };
}

/**
 * Fetches profile telemetry and contribution calendar using GitHub GraphQL API.
 * Uses explicit from and to timestamps covering the rolling 365-day interval.
 */
export async function fetchGraphQLTelemetry(token, username = USERNAME, customDates = {}) {
  if (!token) {
    return { ok: false, reason: 'NO_TOKEN', data: null, source: 'GRAPHQL' };
  }

  const now = new Date();
  const to = customDates.to || now.toISOString();
  const from = customDates.from || new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        followers { totalCount }
        following { totalCount }
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}) {
          totalCount
          nodes {
            name
            stargazerCount
            forkCount
            pushedAt
            primaryLanguage { name }
          }
        }
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Shinobi-Profile-Telemetry-Engine',
      },
      body: JSON.stringify({ query, variables: { username, from, to } }),
    });

    if (res.status === 401) {
      return { ok: false, reason: 'AUTH_FAILED', data: null, source: 'GRAPHQL' };
    }
    if (res.status === 403) {
      return { ok: false, reason: 'RATE_LIMITED', data: null, source: 'GRAPHQL' };
    }
    if (!res.ok) {
      return { ok: false, reason: `HTTP_${res.status}`, data: null, source: 'GRAPHQL' };
    }

    const json = await res.json();
    if (json.errors && json.errors.length > 0) {
      return { ok: false, reason: 'GRAPHQL_ERROR', data: null, source: 'GRAPHQL', errors: json.errors };
    }

    const userData = json.data?.user;
    if (!userData) {
      return { ok: false, reason: 'USER_NOT_FOUND', data: null, source: 'GRAPHQL' };
    }

    // Aggregate repos
    const repoNodes = userData.repositories?.nodes || [];
    let totalStars = 0;
    let totalForks = 0;
    const langMap = {};

    repoNodes.forEach((r) => {
      totalStars += (r.stargazerCount || 0);
      totalForks += (r.forkCount || 0);
      if (r.primaryLanguage?.name) {
        langMap[r.primaryLanguage.name] = (langMap[r.primaryLanguage.name] || 0) + 1;
      }
    });

    const topLangs = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([l]) => l);

    const latestRepo = repoNodes.length > 0 ? repoNodes[0] : null;
    const latestRepoName = latestRepo ? latestRepo.name : 'sakthirenganathan-dev';
    const latestRepoTime = latestRepo ? latestRepo.pushedAt.split('T')[0] : 'Today';

    const calendar = userData.contributionsCollection?.contributionCalendar;
    const streakMetrics = calculateContributionMetrics(calendar, DEFAULT_TIMEZONE);

    return {
      ok: true,
      reason: 'LIVE_OK',
      source: 'GITHUB_GRAPHQL',
      data: {
        publicRepos: userData.repositories?.totalCount ?? repoNodes.length,
        followers: userData.followers?.totalCount ?? 0,
        following: userData.following?.totalCount ?? 0,
        totalStars,
        totalForks,
        topLangs: topLangs.length > 0 ? topLangs : ['TypeScript', 'JavaScript', 'HTML', 'CSS'],
        latestRepoName,
        latestRepoTime,
        totalContributions: streakMetrics?.totalContributions ?? null,
        currentStreak: streakMetrics?.currentStreak ?? null,
        longestStreak: streakMetrics?.longestStreak ?? null,
        longestStreakStart: streakMetrics?.longestStreakStart ?? null,
        longestStreakEnd: streakMetrics?.longestStreakEnd ?? null,
        dataRangeStart: streakMetrics?.dataRangeStart ?? null,
        dataRangeEnd: streakMetrics?.dataRangeEnd ?? null,
        timezone: DEFAULT_TIMEZONE,
      },
    };
  } catch (err) {
    return { ok: false, reason: `NETWORK_ERROR: ${err.message}`, data: null, source: 'GRAPHQL' };
  }
}

/**
 * Fetches repository operational telemetry using GitHub REST API.
 */
export async function fetchRestTelemetry(token, username = USERNAME) {
  const headers = {
    'User-Agent': 'Shinobi-Profile-Telemetry-Engine',
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, { headers }),
    ]);

    if (userRes.status === 401 || reposRes.status === 401) {
      return { ok: false, reason: 'AUTH_FAILED', data: null, source: 'REST' };
    }
    if (userRes.status === 403 || reposRes.status === 403) {
      return { ok: false, reason: 'RATE_LIMITED', data: null, source: 'REST' };
    }
    if (!userRes.ok) {
      return { ok: false, reason: `HTTP_${userRes.status}`, data: null, source: 'REST' };
    }

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];

    let totalStars = 0;
    let totalForks = 0;
    const langMap = {};

    repos.forEach((r) => {
      totalStars += (r.stargazers_count ?? 0);
      totalForks += (r.forks_count ?? 0);
      if (r.language) {
        langMap[r.language] = (langMap[r.language] || 0) + 1;
      }
    });

    const topLangs = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([l]) => l);

    const latestRepo = repos.length > 0 ? repos[0] : null;

    return {
      ok: true,
      reason: 'REST_OK',
      source: 'GITHUB_REST',
      data: {
        publicRepos: typeof user.public_repos === 'number' ? user.public_repos : repos.length,
        followers: typeof user.followers === 'number' ? user.followers : 0,
        following: typeof user.following === 'number' ? user.following : 0,
        totalStars,
        totalForks,
        topLangs: topLangs.length > 0 ? topLangs : ['TypeScript', 'JavaScript', 'HTML', 'CSS'],
        latestRepoName: latestRepo ? latestRepo.name : 'sakthirenganathan-dev',
        latestRepoTime: latestRepo ? latestRepo.pushed_at.split('T')[0] : 'Today',
      },
    };
  } catch (err) {
    return { ok: false, reason: `NETWORK_ERROR: ${err.message}`, data: null, source: 'REST' };
  }
}

/**
 * Validates and merges freshly fetched data with previous cached snapshot.
 * Maintains independent provenance and freshness for:
 * 1. Repository metrics (repoStatus, repoLastSync, repoDataSource)
 * 2. Contribution metrics (contribStatus, contribLastSync, contribDataSource)
 */
export function validateAndMergeTelemetry(repoResult, contribResult, existingCache) {
  const cache = existingCache || {};
  const nowUTC = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

  // 1. Repository Data Freshness
  const repoOk = !!repoResult?.ok && repoResult?.data !== null;
  const repoData = repoResult?.data;
  const repoStatus = repoOk ? 'LIVE' : 'CACHED';
  const repoDataSource = repoOk ? (repoResult.source || 'GITHUB_REST') : (cache.repoDataSource || 'CACHE_FALLBACK');
  const repoLastSync = repoOk ? nowUTC : (cache.repoLastSync || cache.lastSynced || nowUTC);

  // 2. Contribution Data Freshness
  const contribOk = !!contribResult?.ok && contribResult?.data?.totalContributions !== null;
  const contribData = contribResult?.data;
  const contribStatus = contribOk ? 'LIVE' : 'CACHED';
  const contribDataSource = contribOk ? (contribResult.source || 'GITHUB_GRAPHQL') : 'CACHE_FALLBACK';
  const contribLastSync = contribOk ? nowUTC : (cache.contribLastSync || cache.lastSynced || nowUTC);

  // Validate repo metrics
  const publicRepos = (repoOk && typeof repoData?.publicRepos === 'number' && repoData.publicRepos >= 0)
    ? repoData.publicRepos
    : (cache.publicRepos ?? 26);

  const followers = (repoOk && typeof repoData?.followers === 'number' && repoData.followers >= 0)
    ? repoData.followers
    : (cache.followers ?? 0);

  const following = (repoOk && typeof repoData?.following === 'number' && repoData.following >= 0)
    ? repoData.following
    : (cache.following ?? 3);

  const totalStars = (repoOk && typeof repoData?.totalStars === 'number' && repoData.totalStars >= 0)
    ? repoData.totalStars
    : (cache.totalStars ?? 1);

  const totalForks = (repoOk && typeof repoData?.totalForks === 'number' && repoData.totalForks >= 0)
    ? repoData.totalForks
    : (cache.totalForks ?? 0);

  const topLangs = (repoOk && Array.isArray(repoData?.topLangs) && repoData.topLangs.length > 0)
    ? repoData.topLangs
    : (cache.topLangs ?? ['TypeScript', 'JavaScript', 'HTML', 'CSS']);

  const latestRepoName = (repoOk && typeof repoData?.latestRepoName === 'string' && repoData.latestRepoName.length > 0)
    ? repoData.latestRepoName
    : (cache.latestRepoName ?? 'sakthirenganathan-dev');

  const latestRepoTime = (repoOk && typeof repoData?.latestRepoTime === 'string')
    ? repoData.latestRepoTime
    : (cache.latestRepoTime ?? 'Today');

  // Validate contribution metrics
  const totalContributions = (contribOk && typeof contribData?.totalContributions === 'number' && contribData.totalContributions >= 0)
    ? contribData.totalContributions
    : (cache.totalContributions ?? 38);

  const currentStreak = (contribOk && typeof contribData?.currentStreak === 'number' && contribData.currentStreak >= 0)
    ? contribData.currentStreak
    : (cache.currentStreak ?? 1);

  const longestStreak = (contribOk && typeof contribData?.longestStreak === 'number' && contribData.longestStreak >= 0)
    ? contribData.longestStreak
    : (cache.longestStreak ?? 2);

  const longestStreakStart = (contribOk && contribData?.longestStreakStart)
    ? contribData.longestStreakStart
    : (cache.longestStreakStart || '2025-11-08');

  const longestStreakEnd = (contribOk && contribData?.longestStreakEnd)
    ? contribData.longestStreakEnd
    : (cache.longestStreakEnd || '2025-11-09');

  const dataRangeStart = (contribOk && contribData?.dataRangeStart)
    ? contribData.dataRangeStart
    : (cache.dataRangeStart || '2025-11-02');

  const dataRangeEnd = (contribOk && contribData?.dataRangeEnd)
    ? contribData.dataRangeEnd
    : (cache.dataRangeEnd || '2026-11-02');

  const lastAttempt = nowUTC;

  return {
    publicRepos,
    followers,
    following,
    totalStars,
    totalForks,
    topLangs,
    latestRepoName,
    latestRepoTime,
    totalContributions,
    currentStreak,
    longestStreak,
    longestStreakStart,
    longestStreakEnd,
    dataRangeStart,
    dataRangeEnd,
    timezone: DEFAULT_TIMEZONE,
    lastAttempt,
    repoLastSync,
    repoStatus,
    repoDataSource,
    contribLastSync,
    contribStatus,
    contribDataSource,
    lastSynced: contribLastSync,
    status: (repoStatus === 'LIVE' && contribStatus === 'LIVE')
      ? 'LIVE_OK'
      : (repoStatus === 'LIVE' ? 'PARTIAL_LIVE' : 'CACHED_SNAPSHOT'),
  };
}

/**
 * Loads cached snapshot from disk safely.
 */
export function loadCache(cachePath = CACHE_FILE) {
  if (fs.existsSync(cachePath)) {
    try {
      const raw = fs.readFileSync(cachePath, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      console.warn(`[WARN] Failed to parse cache file: ${e.message}`);
    }
  }
  return null;
}

/**
 * Formats a day-level date range (e.g. "Aug 19 – 23" or "Nov 8 – 9")
 */
export function formatDateRange(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 'Peak Discipline';
  try {
    const s = new Date(startDateStr);
    const e = new Date(endDateStr);
    const sMonth = s.toLocaleString('en-US', { month: 'short' });
    const sDay = s.getDate();
    const eMonth = e.toLocaleString('en-US', { month: 'short' });
    const eDay = e.getDate();

    if (sMonth === eMonth) {
      return `${sMonth} ${sDay} – ${eDay}`;
    }
    return `${sMonth} ${sDay} – ${eMonth} ${eDay}`;
  } catch (err) {
    return 'Peak Discipline';
  }
}

/**
 * Formats a month-level date range (e.g. "Nov 2025 – Nov 2026")
 */
export function formatMonthYearRange(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 'Past 12 Months';
  try {
    const s = new Date(startDateStr);
    const e = new Date(endDateStr);
    const sMonth = s.toLocaleString('en-US', { month: 'short' });
    const sYear = s.getFullYear();
    const eMonth = e.toLocaleString('en-US', { month: 'short' });
    const eYear = e.getFullYear();

    if (sYear === eYear) {
      return `${sMonth} – ${eMonth} ${sYear}`;
    }
    return `${sMonth} ${sYear} – ${eMonth} ${eYear}`;
  } catch (err) {
    return 'Past 12 Months';
  }
}

/**
 * Generates the clean, standards-compliant 1200 x 390 Shinobi Intelligence SVG.
 * Strictly describes contribution calendar data as "TOTAL CONTRIBUTIONS" over its verified date range.
 * Reflects independent repository and contribution freshness statuses.
 */
export function generateTelemetrySvg(data) {
  const lang0 = data.topLangs[0] || 'TypeScript';
  const lang1 = data.topLangs[1] || 'JavaScript';
  const lang2 = data.topLangs[2] || 'HTML';
  const lang3 = data.topLangs[3] || 'CSS';

  const totalContributions = data.totalContributions;
  const currentStreak = data.currentStreak;
  const longestStreak = data.longestStreak;

  // Objective Status Descriptor
  const streakStatusLabel = currentStreak > 0
    ? 'ACTIVE STREAK // SYNCHRONIZED'
    : 'STANDBY // AWAITING DISPATCH';
  const streakStatusColor = currentStreak > 0 ? '#22c55e' : '#fbbf24';

  const longestRecordDates = formatDateRange(data.longestStreakStart, data.longestStreakEnd);
  const contributionRange = formatMonthYearRange(data.dataRangeStart, data.dataRangeEnd);

  // Panel Status Labels
  const leftPanelStatus = data.repoStatus === 'LIVE' ? 'LIVE STATS' : 'CACHED';
  const leftPanelColor = data.repoStatus === 'LIVE' ? '#38bdf8' : '#fbbf24';

  const rightPanelStatus = data.contribStatus === 'LIVE' ? '火の意志 · ACTIVE' : '火の意志 · CACHED';
  const rightPanelColor = data.contribStatus === 'LIVE' ? '#f43f5e' : '#fbbf24';

  // Footer status indicator
  let footerStatus = '';
  if (data.repoStatus === 'LIVE' && data.contribStatus === 'LIVE') {
    footerStatus = `LAST TELEMETRY SYNC: <tspan fill="#a855f7" font-weight="700">${data.contribLastSync}</tspan> // LIVE GITHUB ACTION DISPATCH · ZERO FABRICATED METRICS`;
  } else if (data.repoStatus === 'LIVE' && data.contribStatus !== 'LIVE') {
    footerStatus = `SYS.TELEMETRY // REPOS: <tspan fill="#38bdf8" font-weight="700">LIVE (${data.repoLastSync})</tspan> · CONTRIBUTIONS: <tspan fill="#fbbf24" font-weight="700">CACHED (${data.contribLastSync})</tspan>`;
  } else {
    footerStatus = `SYS.TELEMETRY // REPOS: <tspan fill="#fbbf24" font-weight="700">CACHED</tspan> · CONTRIBUTIONS: <tspan fill="#fbbf24" font-weight="700">CACHED (${data.contribLastSync})</tspan> // ATT: ${data.lastAttempt}`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="390" viewBox="0 0 1200 390" role="img" aria-label="Shinobi Intelligence Telemetry &amp; Chakra Streak Console">
  <defs>
    <!-- Background Space Atmosphere -->
    <radialGradient id="teleBg" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#140628" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="#090217" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#020006" stop-opacity="1"/>
    </radialGradient>

    <!-- Glass Card Gradients -->
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#110526" stop-opacity="0.92"/>
      <stop offset="50%" stop-color="#090217" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#05010e" stop-opacity="0.98"/>
    </linearGradient>

    <linearGradient id="borderLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.75"/>
      <stop offset="50%" stop-color="#7c3aed" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.6"/>
    </linearGradient>

    <linearGradient id="borderRight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.75"/>
      <stop offset="50%" stop-color="#a855f7" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.7"/>
    </linearGradient>

    <!-- Flame & Chakra Gradients -->
    <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="45%" stop-color="#fb923c"/>
      <stop offset="75%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#67e8f9"/>
    </linearGradient>

    <linearGradient id="chakraBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="35%" stop-color="#c084fc"/>
      <stop offset="70%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>

    <linearGradient id="scanBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0"/>
      <stop offset="30%" stop-color="#67e8f9" stop-opacity="0.35"/>
      <stop offset="70%" stop-color="#a855f7" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </linearGradient>

    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>

    <!-- Ambient Grid Pattern -->
    <pattern id="cyberGrid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#a855f7" stroke-width="0.5" stroke-opacity="0.06"/>
      <circle cx="0" cy="0" r="1" fill="#67e8f9" fill-opacity="0.15"/>
    </pattern>

    <!-- Filters -->
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="textGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="#c084fc" flood-opacity="0.6"/>
    </filter>

    <filter id="flameGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#f43f5e" flood-opacity="0.8"/>
    </filter>

    <style>
      @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
      @keyframes scanSweep {
        0% { transform: translateX(30px); opacity: 0; }
        15% { opacity: 0.4; }
        85% { opacity: 0.4; }
        100% { transform: translateX(1170px); opacity: 0; }
      }
      @keyframes blinkBeacon {
        0%, 100% { opacity: 0.4; transform: scale(0.9); }
        50% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 8px #22c55e); }
      }
      @keyframes flameBreathe {
        0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px #f43f5e); }
        50% { transform: scale(1.08); filter: drop-shadow(0 0 16px #fb923c); }
      }
      @keyframes pulseBar {
        0%, 100% { opacity: 0.85; }
        50% { opacity: 1; filter: drop-shadow(0 0 8px #06b6d4); }
      }
      @keyframes pipPulse1 { 0%, 100% { opacity: 0.35; } 33% { opacity: 1; } }
      @keyframes pipPulse2 { 0%, 100% { opacity: 0.35; } 66% { opacity: 1; } }
      @keyframes pipPulse3 { 0%, 100% { opacity: 0.35; } 99% { opacity: 1; } }

      .cursor-blink { animation: blink 1.1s step-end infinite; }
      .scan-line { animation: scanSweep 6.5s ease-in-out infinite; }
      .beacon { animation: blinkBeacon 2.2s ease-in-out infinite; transform-origin: 0px 0px; }
      .flame-anim { animation: flameBreathe 3s ease-in-out infinite; transform-origin: 195px 125px; }
      .pulse-bar { animation: pulseBar 3.2s ease-in-out infinite; }
      .pip-1 { animation: pipPulse1 2.2s infinite; }
      .pip-2 { animation: pipPulse2 2.2s infinite; }
      .pip-3 { animation: pipPulse3 2.2s infinite; }

      .f-mono { font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace; }
      .f-sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }

      @media (prefers-reduced-motion: reduce) {
        .cursor-blink, .scan-line, .beacon, .flame-anim, .pulse-bar, .pip-1, .pip-2, .pip-3 {
          animation: none !important;
        }
      }
    </style>
  </defs>

  <!-- Canvas Background -->
  <rect width="1200" height="390" fill="url(#teleBg)"/>
  <rect width="1200" height="390" fill="url(#cyberGrid)"/>

  <!-- Scanning Radar Beam -->
  <rect x="0" y="16" width="3" height="358" fill="url(#scanBeamGrad)" class="scan-line" opacity="0.4"/>

  <!-- Header Bar -->
  <g transform="translate(36, 16)">
    <!-- Terminal Prompt Pill -->
    <rect x="0" y="0" width="280" height="26" rx="13" fill="#1e093b" stroke="#7c3aed" stroke-opacity="0.5" stroke-width="1"/>
    <text x="14" y="17" class="f-mono" font-size="11" font-weight="700" fill="#67e8f9">&gt;_ shinobi.telemetry/sakthi</text>
    <text x="210" y="17" class="f-mono" font-size="11" font-weight="700" fill="#a855f7">| live</text>
    <rect class="cursor-blink" x="252" y="6" width="6" height="14" rx="1" fill="#22c55e"/>

    <!-- Center Section Banner -->
    <text x="564" y="17" class="f-mono" font-size="11.5" font-weight="800" fill="#c084fc" letter-spacing="2.5" text-anchor="middle">
      04 // LIVE SHINOBI INTELLIGENCE &amp; WILL OF FIRE TELEMETRY
    </text>

    <!-- Village Identifier Badge -->
    <text x="1128" y="17" class="f-mono" font-size="11" font-weight="800" fill="#67e8f9" letter-spacing="1.2" text-anchor="end">
      木ノ葉 // KONOHA.SYS
    </text>
  </g>

  <!-- Left Panel: GitHub Operational Telemetry -->
  <g transform="translate(36, 54)">
    <!-- Card Base: 548 x 294 -->
    <rect width="548" height="294" rx="16" fill="url(#cardBg)" stroke="url(#borderLeft)" stroke-width="1.5" filter="url(#softGlow)"/>

    <!-- Panel Header Bar -->
    <rect width="548" height="38" rx="16" fill="#140628" fill-opacity="0.85"/>
    <line x1="0" y1="38" x2="548" y2="38" stroke="#a855f7" stroke-opacity="0.25" stroke-width="1"/>

    <!-- Window Dots -->
    <circle cx="22" cy="19" r="4.5" fill="#f43f5e" fill-opacity="0.85"/>
    <circle cx="38" cy="19" r="4.5" fill="#fbbf24" fill-opacity="0.85"/>
    <circle cx="54" cy="19" r="4.5" fill="#22c55e" fill-opacity="0.85"/>

    <text x="74" y="23" class="f-mono" font-size="11" font-weight="800" fill="#cbd5e1" letter-spacing="1.2">
      SYS.INTEL // REPOSITORIES &amp; IMPACT
    </text>
    <text x="526" y="23" class="f-mono" font-size="10.5" font-weight="700" fill="${leftPanelColor}" text-anchor="end">
      ${leftPanelStatus}
    </text>

    <!-- Body Content -->
    <!-- Metric 1: Public Repositories (Primary Counter) -->
    <g transform="translate(28, 64)">
      <!-- Activity Pips -->
      <g transform="translate(0, 0)">
        <circle cx="0" cy="0" r="2.2" fill="#06b6d4" class="pip-1"/>
        <circle cx="7" cy="0" r="2.2" fill="#a855f7" class="pip-2"/>
        <circle cx="14" cy="0" r="2.2" fill="#22c55e" class="pip-3"/>
        <text x="26" y="4" class="f-mono" font-size="10.5" font-weight="700" fill="#94a3b8" letter-spacing="1.5">PUBLIC OPEN-SOURCE REPOSITORIES</text>
      </g>
      <text x="0" y="38" class="f-sans" font-size="34" font-weight="900" fill="url(#titleGrad)" filter="url(#textGlow)">${data.publicRepos}</text>
      <text x="60" y="36" class="f-sans" font-size="13" font-weight="600" fill="#67e8f9">Scrolls masterfully deployed</text>
    </g>

    <!-- Divider Line -->
    <line x1="28" y1="130" x2="520" y2="130" stroke="#7c3aed" stroke-opacity="0.2" stroke-width="1"/>

    <!-- Metric 2: Impact Counters (Stars, Followers, Forks) -->
    <g transform="translate(28, 148)">
      <!-- Stars Box -->
      <rect x="0" y="0" width="160" height="48" rx="8" fill="#180733" stroke="#a855f7" stroke-opacity="0.3" stroke-width="1"/>
      <text x="14" y="20" class="f-mono" font-size="9.5" font-weight="700" fill="#94a3b8" letter-spacing="1">EARNED STARS</text>
      <text x="14" y="39" class="f-sans" font-size="17" font-weight="900" fill="#fbbf24">⭐ ${data.totalStars}</text>

      <!-- Followers Box -->
      <rect x="174" y="0" width="160" height="48" rx="8" fill="#180733" stroke="#a855f7" stroke-opacity="0.3" stroke-width="1"/>
      <text x="188" y="20" class="f-mono" font-size="9.5" font-weight="700" fill="#94a3b8" letter-spacing="1">FOLLOWERS</text>
      <text x="188" y="39" class="f-sans" font-size="17" font-weight="900" fill="#67e8f9">👥 ${data.followers}</text>

      <!-- Code Forks Box -->
      <rect x="348" y="0" width="144" height="48" rx="8" fill="#180733" stroke="#a855f7" stroke-opacity="0.3" stroke-width="1"/>
      <text x="362" y="20" class="f-mono" font-size="9.5" font-weight="700" fill="#94a3b8" letter-spacing="1">TOTAL FORKS</text>
      <text x="362" y="39" class="f-sans" font-size="17" font-weight="900" fill="#c084fc">🍴 ${data.totalForks}</text>
    </g>

    <!-- Metric 3: Top Elemental Chakra Natures (Languages) -->
    <g transform="translate(28, 218)">
      <text x="0" y="0" class="f-mono" font-size="10" font-weight="700" fill="#94a3b8" letter-spacing="1.2">TOP CHAKRA NATURES (LANGUAGES):</text>
      <g transform="translate(0, 10)">
        <!-- Language 1 -->
        <rect x="0" y="0" width="112" height="24" rx="6" fill="#1e103d" stroke="#38bdf8" stroke-width="1"/>
        <circle cx="12" cy="12" r="3.5" fill="#38bdf8"/>
        <text x="24" y="16" class="f-sans" font-size="11" font-weight="700" fill="#f1f5f9">${lang0}</text>

        <!-- Language 2 -->
        <rect x="122" y="0" width="112" height="24" rx="6" fill="#1e103d" stroke="#fbbf24" stroke-width="1"/>
        <circle cx="134" cy="12" r="3.5" fill="#fbbf24"/>
        <text x="146" y="16" class="f-sans" font-size="11" font-weight="700" fill="#f1f5f9">${lang1}</text>

        <!-- Language 3 -->
        <rect x="244" y="0" width="94" height="24" rx="6" fill="#1e103d" stroke="#34d399" stroke-width="1"/>
        <circle cx="256" cy="12" r="3.5" fill="#34d399"/>
        <text x="268" y="16" class="f-sans" font-size="11" font-weight="700" fill="#f1f5f9">${lang2}</text>

        <!-- Language 4 -->
        <rect x="348" y="0" width="84" height="24" rx="6" fill="#1e103d" stroke="#c084fc" stroke-width="1"/>
        <circle cx="360" cy="12" r="3.5" fill="#c084fc"/>
        <text x="372" y="16" class="f-sans" font-size="11" font-weight="700" fill="#f1f5f9">${lang3}</text>
      </g>
    </g>

    <!-- Latest Active Scroll Tag -->
    <g transform="translate(28, 276)">
      <!-- Beacon -->
      <g transform="translate(4, -4)">
        <circle cx="0" cy="0" r="4.5" fill="#22c55e" class="beacon"/>
        <circle cx="0" cy="0" r="2" fill="#ffffff"/>
      </g>
      <text x="16" y="0" class="f-mono" font-size="10.5" font-weight="700" fill="#64748b" letter-spacing="1">
        LATEST DISPATCH: <tspan fill="#86efac" font-weight="800">${data.latestRepoName}</tspan> // ACTIVE
      </text>
    </g>
  </g>

  <!-- Right Panel: Will of Fire Chakra Streak Console -->
  <g transform="translate(616, 54)">
    <!-- Card Base: 548 x 294 -->
    <rect width="548" height="294" rx="16" fill="url(#cardBg)" stroke="url(#borderRight)" stroke-width="1.5" filter="url(#softGlow)"/>

    <!-- Panel Header Bar -->
    <rect width="548" height="38" rx="16" fill="#0d031c" fill-opacity="0.85"/>
    <line x1="0" y1="38" x2="548" y2="38" stroke="#06b6d4" stroke-opacity="0.3" stroke-width="1"/>

    <!-- Window Dots -->
    <circle cx="22" cy="19" r="4.5" fill="#a855f7" fill-opacity="0.85"/>
    <circle cx="38" cy="19" r="4.5" fill="#06b6d4" fill-opacity="0.85"/>
    <circle cx="54" cy="19" r="4.5" fill="#22c55e" fill-opacity="0.85"/>

    <text x="74" y="23" class="f-mono" font-size="11" font-weight="800" fill="#cbd5e1" letter-spacing="1.2">
      WILL OF FIRE // CHAKRA COMMIT STREAK
    </text>
    <text x="526" y="23" class="f-mono" font-size="10.5" font-weight="700" fill="${rightPanelColor}" text-anchor="end">
      ${rightPanelStatus}
    </text>

    <!-- Body Content: Center Flame & 3 Dynamic Streak Badges -->
    <!-- Center Dynamic Flame Emblem with Breathing Aura -->
    <g class="flame-anim" transform="translate(195, 125)">
      <!-- Outer Flame Halo -->
      <circle cx="0" cy="-6" r="38" fill="url(#scanBeamGrad)" opacity="0.3"/>
      <!-- Multi-tier Stylized Shinobi Flame (火) -->
      <path d="M 0 -36 C 8 -22 24 -14 24 8 C 24 22 13 32 0 32 C -13 32 -24 22 -24 8 C -24 -10 -10 -22 0 -36 Z" fill="url(#flameGrad)" filter="url(#flameGlow)"/>
      <path d="M 0 -24 C 5 -14 15 -8 15 6 C 15 15 8 22 0 22 C -8 22 -15 15 -15 6 C -15 -6 -6 -14 0 -24 Z" fill="#ffffff" opacity="0.9"/>
      <!-- Core Kanji: 火 (Fire) -->
      <text x="0" y="7" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="14" fill="#0f021e" text-anchor="middle">火</text>
    </g>

    <!-- Streak Metric 1: Total Contributions (Sourced accurately from GraphQL contributionCalendar) -->
    <g transform="translate(28, 56)">
      <rect x="0" y="0" width="118" height="136" rx="12" fill="#17072e" stroke="#7c3aed" stroke-opacity="0.4" stroke-width="1"/>
      <text x="59" y="24" class="f-mono" font-size="8.5" font-weight="800" fill="#a78bfa" letter-spacing="0.8" text-anchor="middle">TOTAL</text>
      <text x="59" y="38" class="f-mono" font-size="7.5" font-weight="700" fill="#64748b" letter-spacing="0.4" text-anchor="middle">CONTRIBUTIONS</text>
      <text x="59" y="82" class="f-sans" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle" filter="url(#textGlow)">${totalContributions}</text>
      <text x="59" y="106" class="f-sans" font-size="9" font-weight="600" fill="#67e8f9" text-anchor="middle">Annual Chakra</text>
      <text x="59" y="122" class="f-mono" font-size="7" font-weight="600" fill="#94a3b8" text-anchor="middle">${contributionRange}</text>
    </g>

    <!-- Streak Metric 2: Current Streak (Center Hero) -->
    <g transform="translate(162, 172)">
      <rect x="0" y="0" width="224" height="44" rx="10" fill="#1f093d" stroke="#f43f5e" stroke-opacity="0.6" stroke-width="1.2"/>
      <text x="16" y="26" class="f-mono" font-size="10" font-weight="800" fill="#fb923c" letter-spacing="1">CURRENT STREAK</text>
      <text x="208" y="28" class="f-sans" font-size="20" font-weight="900" fill="#ffffff" text-anchor="end" filter="url(#flameGlow)">${currentStreak} <tspan font-size="12" fill="#67e8f9">DAYS</tspan></text>
    </g>

    <!-- Streak Metric 3: Longest Streak -->
    <g transform="translate(402, 56)">
      <rect x="0" y="0" width="118" height="136" rx="12" fill="#17072e" stroke="#06b6d4" stroke-opacity="0.4" stroke-width="1"/>
      <text x="59" y="24" class="f-mono" font-size="9" font-weight="800" fill="#38bdf8" letter-spacing="1.2" text-anchor="middle">LONGEST</text>
      <text x="59" y="38" class="f-mono" font-size="8.5" font-weight="700" fill="#64748b" letter-spacing="0.8" text-anchor="middle">RECORD</text>
      <text x="59" y="82" class="f-sans" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle" filter="url(#textGlow)">${longestStreak}</text>
      <text x="59" y="106" class="f-sans" font-size="9" font-weight="600" fill="#f43f5e" text-anchor="middle">Peak Discipline</text>
      <text x="59" y="122" class="f-mono" font-size="7.5" font-weight="600" fill="#94a3b8" text-anchor="middle">${longestRecordDates}</text>
    </g>

    <!-- Chakra Energy Progress Bar (Honest Objective Status) -->
    <g transform="translate(28, 230)">
      <text x="0" y="0" class="f-mono" font-size="10" font-weight="800" fill="#c084fc" letter-spacing="1.5">CHAKRA STREAK HARMONIC RESONANCE</text>
      <text x="492" y="0" class="f-mono" font-size="10" font-weight="800" fill="${streakStatusColor}" text-anchor="end">${streakStatusLabel}</text>

      <rect x="0" y="8" width="492" height="8" rx="4" fill="#1a0633" stroke="#7c3aed" stroke-opacity="0.4" stroke-width="1"/>
      <rect class="pulse-bar" x="0" y="8" width="492" height="8" rx="4" fill="url(#chakraBarGrad)">
        <animate attributeName="width" values="160;492;492;160" keyTimes="0;0.5;0.92;1" dur="7.5s" repeatCount="indefinite"/>
      </rect>
    </g>

    <!-- Shinobi Philosophy Quote -->
    <g transform="translate(28, 276)">
      <text x="0" y="0" class="f-sans" font-size="11" font-weight="600" fill="#94a3b8" letter-spacing="0.4">
        “The Will of Fire burns brightest through daily code discipline.”
      </text>
    </g>
  </g>

  <!-- Footer: Automated Dispatch Sync -->
  <g transform="translate(600, 375)" text-anchor="middle">
    <text class="f-mono" font-size="10.5" fill="#64748b" letter-spacing="1.8">
      ${footerStatus}
    </text>
  </g>
</svg>`;
}

/**
 * Main execution orchestration.
 */
export async function run(options = {}) {
  const token = options.token || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || null;
  const username = options.username || USERNAME;
  const cachePath = options.cachePath || CACHE_FILE;
  const outputPath = options.outputPath || OUTPUT_SVG;

  console.log(`[START] Executing Shinobi Live Telemetry Engine for @${username}...`);

  const existingCache = loadCache(cachePath);

  // 1. Fetch Repository Telemetry (REST or GraphQL)
  let repoResult = null;
  let contribResult = null;

  if (token) {
    console.log('[INFO] Token detected. Attempting full GraphQL telemetry...');
    const gqlResult = await fetchGraphQLTelemetry(token, username);
    if (gqlResult.ok) {
      console.log('[SUCCESS] GraphQL telemetry and contribution calendar retrieved');
      repoResult = gqlResult;
      contribResult = gqlResult;
    } else {
      console.warn(`[WARN] GraphQL failed (${gqlResult.reason}). Falling back to REST for repos...`);
      repoResult = await fetchRestTelemetry(token, username);
      contribResult = { ok: false, reason: gqlResult.reason, data: null };
    }
  } else {
    console.log('[NOTICE] Unauthenticated mode. Fetching repository data via REST API...');
    repoResult = await fetchRestTelemetry(null, username);
    contribResult = { ok: false, reason: 'NO_TOKEN', data: null };
  }

  // 2. Validate & Merge with Snapshot Cache (Independent freshness tracking)
  const validatedData = validateAndMergeTelemetry(repoResult, contribResult, existingCache);

  console.log(`[STATUS] Telemetry state: Repos = ${validatedData.repoStatus} (${validatedData.repoDataSource}), Contributions = ${validatedData.contribStatus} (${validatedData.contribDataSource})`);

  // 3. Save clean snapshot cache
  try {
    fs.writeFileSync(cachePath, JSON.stringify(validatedData, null, 2), 'utf8');
    console.log(`[INFO] Telemetry cache persisted to ${cachePath}`);
  } catch (err) {
    console.warn(`[WARN] Could not write cache file: ${err.message}`);
  }

  // 4. Generate and write SVG
  const svgContent = generateTelemetrySvg(validatedData);
  fs.writeFileSync(outputPath, svgContent, 'utf8');
  console.log(`[SUCCESS] Shinobi Telemetry Console generated at ${outputPath}`);

  return validatedData;
}

// Auto-run when executed directly via Node
if (process.argv[1] && process.argv[1].endsWith('update-shinobi-live.js')) {
  run().catch((err) => {
    console.error('[FATAL] Telemetry engine failed:', err);
    process.exit(1);
  });
}
