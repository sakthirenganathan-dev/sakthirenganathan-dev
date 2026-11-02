import assert from 'node:assert';
import {
  calculateContributionMetrics,
  validateAndMergeTelemetry,
  generateTelemetrySvg,
  isConsecutiveDay,
  DEFAULT_TIMEZONE,
} from './update-shinobi-live.js';

console.log('================================================================');
console.log('SHINOBI ENGINE — STREAK INTEGRITY & LANGUAGE PROVENANCE TESTS');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] Test ${totalTests}: ${name}`);
    console.error(`       Error: ${err.message}`);
  }
}

// -----------------------------------------------------------------------------
// Test 1: Current streak = 1 day (today active, yesterday inactive)
// -----------------------------------------------------------------------------
runTest('Current streak = 1 day (today active, yesterday inactive)', () => {
  const deterministicDate = '2026-11-02T12:00:00Z'; // 2026-11-02 in Asia/Kolkata
  const calendar = {
    totalContributions: 10,
    weeks: [
      {
        contributionDays: [
          { date: '2026-10-31', contributionCount: 5 },
          { date: '2026-11-01', contributionCount: 0 }, // yesterday inactive
          { date: '2026-11-02', contributionCount: 5 }, // today active
        ],
      },
    ],
  };

  const metrics = calculateContributionMetrics(calendar, DEFAULT_TIMEZONE, deterministicDate);
  assert.strictEqual(metrics.currentStreak, 1, 'Current streak must be 1 day');
});

// -----------------------------------------------------------------------------
// Test 2: Current streak = 2 consecutive days (today and yesterday both active)
// -----------------------------------------------------------------------------
runTest('Current streak = 2 consecutive days (today and yesterday active)', () => {
  const deterministicDate = '2026-11-02T12:00:00Z';
  const calendar = {
    totalContributions: 8,
    weeks: [
      {
        contributionDays: [
          { date: '2026-10-31', contributionCount: 0 },
          { date: '2026-11-01', contributionCount: 3 }, // yesterday active
          { date: '2026-11-02', contributionCount: 5 }, // today active
        ],
      },
    ],
  };

  const metrics = calculateContributionMetrics(calendar, DEFAULT_TIMEZONE, deterministicDate);
  assert.strictEqual(metrics.currentStreak, 2, 'Current streak must be 2 days');
});

// -----------------------------------------------------------------------------
// Test 3: Current streak = 0 when today and yesterday are inactive
// -----------------------------------------------------------------------------
runTest('Current streak = 0 when today and yesterday are inactive', () => {
  const deterministicDate = '2026-11-02T12:00:00Z';
  const calendar = {
    totalContributions: 10,
    weeks: [
      {
        contributionDays: [
          { date: '2026-10-30', contributionCount: 5 },
          { date: '2026-10-31', contributionCount: 5 },
          { date: '2026-11-01', contributionCount: 0 }, // yesterday inactive
          { date: '2026-11-02', contributionCount: 0 }, // today inactive
        ],
      },
    ],
  };

  const metrics = calculateContributionMetrics(calendar, DEFAULT_TIMEZONE, deterministicDate);
  assert.strictEqual(metrics.currentStreak, 0, 'Current streak must be 0');
});

// -----------------------------------------------------------------------------
// Test 4: Current streak preserved when today = 0 but yesterday is active
// -----------------------------------------------------------------------------
runTest('Current streak preserved when today = 0 but yesterday is active', () => {
  const deterministicDate = '2026-11-02T12:00:00Z';
  const calendar = {
    totalContributions: 9,
    weeks: [
      {
        contributionDays: [
          { date: '2026-10-30', contributionCount: 0 },
          { date: '2026-10-31', contributionCount: 4 }, // day - 2 active
          { date: '2026-11-01', contributionCount: 5 }, // yesterday active
          { date: '2026-11-02', contributionCount: 0 }, // today not yet contributed
        ],
      },
    ],
  };

  const metrics = calculateContributionMetrics(calendar, DEFAULT_TIMEZONE, deterministicDate);
  assert.strictEqual(metrics.currentStreak, 2, 'Streak must be preserved from yesterday (2 days)');
});

// -----------------------------------------------------------------------------
// Test 5: Annual longest streak = 2 days for November 8–9, 2025
// -----------------------------------------------------------------------------
runTest('Annual longest streak = 2 days for November 8–9, 2025', () => {
  const calendar = {
    totalContributions: 38,
    weeks: [
      {
        contributionDays: [
          { date: '2025-11-02', contributionCount: 0 },
          { date: '2025-11-08', contributionCount: 20 },
          { date: '2025-11-09', contributionCount: 18 },
          { date: '2025-11-10', contributionCount: 0 },
          { date: '2026-11-02', contributionCount: 0 },
        ],
      },
    ],
  };

  const metrics = calculateContributionMetrics(calendar, DEFAULT_TIMEZONE, '2026-11-02T12:00:00Z');
  assert.strictEqual(metrics.longestStreak, 2, 'Annual longest streak must be 2');
  assert.strictEqual(metrics.longestStreakStart, '2025-11-08');
  assert.strictEqual(metrics.longestStreakEnd, '2025-11-09');
});

// -----------------------------------------------------------------------------
// Test 6: Annual longest streak must not be confused with historical 5-day streak
// -----------------------------------------------------------------------------
runTest('Annual longest streak isolated from historical August 2023 5-day streak', () => {
  // Annual calendar only covers 2025-11-02 to 2026-11-02
  const annualCalendar = {
    totalContributions: 38,
    weeks: [
      {
        contributionDays: [
          { date: '2025-11-08', contributionCount: 20 },
          { date: '2025-11-09', contributionCount: 18 },
        ],
      },
    ],
  };
  const annualMetrics = calculateContributionMetrics(annualCalendar, DEFAULT_TIMEZONE, '2026-11-02T12:00:00Z');
  assert.strictEqual(annualMetrics.longestStreak, 2, 'Annual calendar must return 2 days, not 5');

  // Lifetime multi-year data (August 2023)
  const historicalCalendar = {
    totalContributions: 169,
    weeks: [
      {
        contributionDays: [
          { date: '2023-08-19', contributionCount: 3 },
          { date: '2023-08-20', contributionCount: 4 },
          { date: '2023-08-21', contributionCount: 2 },
          { date: '2023-08-22', contributionCount: 5 },
          { date: '2023-08-23', contributionCount: 6 },
        ],
      },
    ],
  };
  const historicalMetrics = calculateContributionMetrics(historicalCalendar, DEFAULT_TIMEZONE, '2023-08-25T12:00:00Z');
  assert.strictEqual(historicalMetrics.longestStreak, 5, 'Historical dataset correctly produces 5 days');
});

// -----------------------------------------------------------------------------
// Test 7: Correct singular/plural display for 1 DAY and N DAYS & ANNUAL LONGEST
// -----------------------------------------------------------------------------
runTest('Singular/plural display: 1 DAY vs N DAYS and ANNUAL LONGEST badge', () => {
  // Case A: 1 Day streak
  const data1Day = {
    publicRepos: 26,
    followers: 0,
    following: 3,
    totalStars: 1,
    totalForks: 0,
    topLangs: ['TypeScript', 'JavaScript', 'HTML', 'CSS'],
    latestRepoName: 'sakthirenganathan-dev',
    latestRepoTime: '2026-11-02',
    totalContributions: 38,
    currentStreak: 1,
    longestStreak: 2,
    longestStreakStart: '2025-11-08',
    longestStreakEnd: '2025-11-09',
    dataRangeStart: '2025-11-02',
    dataRangeEnd: '2026-11-02',
    timezone: 'Asia/Kolkata',
    lastAttempt: '2026-11-02 16:38 UTC',
    repoLastSync: '2026-11-02 16:38 UTC',
    repoStatus: 'LIVE',
    repoDataSource: 'GITHUB_REST',
    contribLastSync: '2026-11-02 16:29 UTC',
    contribStatus: 'LIVE',
    contribDataSource: 'GITHUB_GRAPHQL',
    status: 'LIVE_OK',
  };

  const svg1 = generateTelemetrySvg(data1Day);
  assert(svg1.includes('1 <tspan font-size="12" fill="#67e8f9">DAY</tspan>'), 'Must render "1 DAY" (singular)');
  assert(!svg1.includes('1 <tspan font-size="12" fill="#67e8f9">DAYS</tspan>'), 'Must NOT render "1 DAYS"');
  assert(svg1.includes('>ANNUAL<'), 'Must contain ANNUAL label');
  assert(svg1.includes('>LONGEST<'), 'Must contain LONGEST label under ANNUAL');
  assert(!svg1.includes('RECORD'), 'Must not contain old RECORD label');

  // Case B: 2 Days streak
  const data2Days = { ...data1Day, currentStreak: 2 };
  const svg2 = generateTelemetrySvg(data2Days);
  assert(svg2.includes('2 <tspan font-size="12" fill="#67e8f9">DAYS</tspan>'), 'Must render "2 DAYS" (plural)');

  // Case C: 0 Days streak
  const data0Days = { ...data1Day, currentStreak: 0 };
  const svg0 = generateTelemetrySvg(data0Days);
  assert(svg0.includes('0 <tspan font-size="12" fill="#67e8f9">DAYS</tspan>'), 'Must render "0 DAYS" (plural)');
});

// -----------------------------------------------------------------------------
// Test 8: Correct Asia/Kolkata date handling near UTC midnight
// -----------------------------------------------------------------------------
runTest('Correct Asia/Kolkata date handling near UTC midnight', () => {
  // 19:00 UTC on 2026-11-02 is 00:30 IST on 2026-11-03 (the next day in Kolkata)
  const nearMidnightUTC = '2026-11-02T19:00:00Z';
  const calendar = {
    totalContributions: 5,
    weeks: [
      {
        contributionDays: [
          { date: '2026-11-02', contributionCount: 2 },
          { date: '2026-11-03', contributionCount: 3 }, // active on IST day
        ],
      },
    ],
  };

  const metrics = calculateContributionMetrics(calendar, 'Asia/Kolkata', nearMidnightUTC);
  // In Asia/Kolkata, today is 2026-11-03. Since 2026-11-03 has 3 contributions and 2026-11-02 has 2,
  // current streak must be 2.
  assert.strictEqual(metrics.currentStreak, 2, 'Kolkata timezone shift across midnight handled accurately');
});

// -----------------------------------------------------------------------------
// Test 9: Missing or incomplete calendar must not fabricate streaks
// -----------------------------------------------------------------------------
runTest('Missing or incomplete calendar does not fabricate streaks', () => {
  assert.strictEqual(calculateContributionMetrics(null), null);
  assert.strictEqual(calculateContributionMetrics({}), null);
  assert.strictEqual(calculateContributionMetrics({ weeks: [] }), null);
  assert.strictEqual(calculateContributionMetrics({ weeks: [{}] }), null);

  const merged = validateAndMergeTelemetry(
    { ok: true, source: 'REST', data: { publicRepos: 26 } },
    { ok: false, reason: 'NO_DATA', data: null },
    { totalContributions: 38, currentStreak: 1, longestStreak: 2 }
  );

  assert.strictEqual(merged.totalContributions, 38, 'Preserves cached contributions');
  assert.strictEqual(merged.currentStreak, 1, 'Preserves cached current streak');
  assert.strictEqual(merged.longestStreak, 2, 'Preserves cached longest streak');
  assert.strictEqual(merged.contribStatus, 'CACHED', 'Properly marks status as CACHED');
});

// -----------------------------------------------------------------------------
// Test 10: Zero-fabrication language resolution
// -----------------------------------------------------------------------------
runTest('Zero-fabrication language resolution and N/A rendering', () => {
  // Case A: Live API detects languages
  const liveResult = {
    ok: true,
    source: 'REST',
    data: { publicRepos: 26, topLangs: ['TypeScript', 'Dart'] },
  };
  const mergedLive = validateAndMergeTelemetry(liveResult, null, { topLangs: ['Python'] });
  assert.deepStrictEqual(mergedLive.topLangs, ['TypeScript', 'Dart'], 'Prefers live detected languages');

  // Case B: Live API fails, verified cache exists
  const failedResult = { ok: false, source: 'REST', data: null };
  const mergedCached = validateAndMergeTelemetry(failedResult, null, { topLangs: ['TypeScript', 'JavaScript'] });
  assert.deepStrictEqual(mergedCached.topLangs, ['TypeScript', 'JavaScript'], 'Preserves verified cached languages on failure');

  // Case C: Neither API nor cache has language data -> empty array, no invented defaults
  const mergedEmpty = validateAndMergeTelemetry(failedResult, null, { topLangs: [] });
  assert.deepStrictEqual(mergedEmpty.topLangs, [], 'Falls back to empty array, not hardcoded defaults');

  // Case D: Empty array in SVG renders N/A
  const svgEmpty = generateTelemetrySvg({
    topLangs: [],
    totalContributions: 0,
    currentStreak: 0,
    longestStreak: 0,
    longestStreakStart: null,
    longestStreakEnd: null,
    dataRangeStart: '2025-11-02',
    dataRangeEnd: '2026-11-02',
    repoStatus: 'CACHED',
    contribStatus: 'CACHED',
    latestRepoName: 'test',
  });
  assert(svgEmpty.includes('>N/A<'), 'Empty languages render as N/A in SVG, not invented languages');
  assert(!svgEmpty.includes('TypeScript'), 'Must not invent TypeScript when data is empty');
});

console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} tests passed successfully.`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
