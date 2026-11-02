import React, { useState, useEffect } from 'react';
import { GitBranch, Star, BookOpen, Clock, Activity, ShieldCheck, RefreshCw } from 'lucide-react';

export default function LiveTelemetry() {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [stats, setStats] = useState({
    totalStars: 0,
    topLanguages: [],
    recentRepo: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const GITHUB_USERNAME = 'sakthirenganathan-dev';
  const CACHE_KEY_PROFILE = 'shinobi_gh_profile';
  const CACHE_KEY_REPOS = 'shinobi_gh_repos';
  const CACHE_TIME_KEY = 'shinobi_gh_cache_time';
  const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  const fetchGitHubIntelligence = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      const isCacheValid = cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_DURATION;

      if (!forceRefresh && isCacheValid) {
        const cachedProfile = JSON.parse(localStorage.getItem(CACHE_KEY_PROFILE));
        const cachedRepos = JSON.parse(localStorage.getItem(CACHE_KEY_REPOS));

        if (cachedProfile && cachedRepos) {
          processData(cachedProfile, cachedRepos);
          setLastUpdated(new Date(parseInt(cachedTime, 10)).toLocaleTimeString());
          setLoading(false);
          return;
        }
      }

      // Live Fetch from GitHub API
      const [profileRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`),
      ]);

      if (!profileRes.ok) {
        throw new Error(`GitHub Profile API status: ${profileRes.status}`);
      }

      const profileData = await profileRes.json();
      const reposData = reposRes.ok ? await reposRes.json() : [];

      // Save to Cache
      localStorage.setItem(CACHE_KEY_PROFILE, JSON.stringify(profileData));
      localStorage.setItem(CACHE_KEY_REPOS, JSON.stringify(reposData));
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());

      processData(profileData, reposData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Live GitHub fetch notice:', err.message);
      setError('Using local fallback telemetry (GitHub API rate limit or offline).');
      
      // Fallback with verified base metrics
      const fallbackProfile = {
        public_repos: 12,
        followers: 4,
        following: 5,
        created_at: '2023-01-01',
      };
      processData(fallbackProfile, []);
    } finally {
      setLoading(false);
    }
  };

  const processData = (profileData, reposData) => {
    setProfile(profileData);
    setRepos(reposData);

    let stars = 0;
    const langCounts = {};

    if (Array.isArray(reposData)) {
      reposData.forEach((r) => {
        stars += r.stargazers_count || 0;
        if (r.language) {
          langCounts[r.language] = (langCounts[r.language] || 0) + 1;
        }
      });
    }

    const sortedLangs = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang);

    setStats({
      totalStars: stars,
      topLanguages: sortedLangs.length > 0 ? sortedLangs : ['JavaScript', 'Python', 'Java', 'Dart', 'HTML'],
      recentRepo: reposData.length > 0 ? reposData[0] : null,
    });
  };

  useEffect(() => {
    fetchGitHubIntelligence();
  }, []);

  return (
    <section id="telemetry" className="relative py-20 px-4 max-w-6xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-3">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>AUTHENTIC GITHUB INTELLIGENCE</span>
        </div>
        <h2 className="font-cinzel text-3xl md:text-5xl font-black text-white uppercase tracking-wider text-glow-purple">
          LIVE SHINOBI TELEMETRY
        </h2>
        <p className="font-mono text-xs text-slate-400 tracking-widest mt-2">
          REAL-TIME REPOSITORY STATS &amp; CLASSIFICATION // @{GITHUB_USERNAME}
        </p>
      </div>

      {/* Control bar with Refresh button & Cache indicator */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-8 border-b border-purple-900/50 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          <span>PROTOCOL: GITHUB REST API v3</span>
          {lastUpdated && <span className="text-slate-500 ml-2">Synced at: {lastUpdated}</span>}
        </div>
        <button
          onClick={() => fetchGitHubIntelligence(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-950/70 border border-purple-700/50 hover:border-cyan-400 text-purple-200 transition-all duration-200 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>REFRESH</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-2.5 rounded-lg bg-purple-950/40 border border-purple-800/40 text-xs font-mono text-purple-300">
          ℹ️ {error}
        </div>
      )}

      {/* Main Stats Display (Cardless flowing metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {/* Metric 1: Public Repositories */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 to-black/60 border border-purple-800/40 flex flex-col items-center text-center backdrop-blur-md shadow-[0_0_30px_rgba(147,51,234,0.15)]">
          <BookOpen className="w-7 h-7 text-cyan-400 mb-3" />
          <span className="font-mono text-3xl md:text-5xl font-black text-white">
            {loading ? '...' : profile?.public_repos ?? '--'}
          </span>
          <span className="font-mono text-xs text-purple-300 tracking-widest mt-2 uppercase">
            Public Repositories
          </span>
        </div>

        {/* Metric 2: Accumulated Stars */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 to-black/60 border border-purple-800/40 flex flex-col items-center text-center backdrop-blur-md shadow-[0_0_30px_rgba(147,51,234,0.15)]">
          <Star className="w-7 h-7 text-yellow-400 mb-3" />
          <span className="font-mono text-3xl md:text-5xl font-black text-white">
            {loading ? '...' : stats.totalStars}
          </span>
          <span className="font-mono text-xs text-purple-300 tracking-widest mt-2 uppercase">
            Total Stars Earned
          </span>
        </div>

        {/* Metric 3: Followers */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 to-black/60 border border-purple-800/40 flex flex-col items-center text-center backdrop-blur-md shadow-[0_0_30px_rgba(147,51,234,0.15)]">
          <GitBranch className="w-7 h-7 text-purple-400 mb-3" />
          <span className="font-mono text-3xl md:text-5xl font-black text-white">
            {loading ? '...' : profile?.followers ?? '--'}
          </span>
          <span className="font-mono text-xs text-purple-300 tracking-widest mt-2 uppercase">
            Shinobi Followers
          </span>
        </div>

        {/* Metric 4: Clearance Rank */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 to-black/60 border border-purple-800/40 flex flex-col items-center text-center backdrop-blur-md shadow-[0_0_30px_rgba(147,51,234,0.15)]">
          <ShieldCheck className="w-7 h-7 text-green-400 mb-3" />
          <span className="font-mono text-2xl md:text-3xl font-black text-cyan-300">
            S-RANK
          </span>
          <span className="font-mono text-xs text-purple-300 tracking-widest mt-2 uppercase">
            Village Clearance
          </span>
        </div>
      </div>

      {/* Languages & Latest Activity Ribbon */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-950/50 to-cyan-950/30 border border-purple-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-mono text-xs text-purple-300 tracking-widest uppercase block mb-2">
            PRIMARY CHAKRA LANGUAGES DETECTED:
          </span>
          <div className="flex flex-wrap gap-2">
            {stats.topLanguages.map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-900/60 border border-purple-500/50 text-cyan-200"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {stats.recentRepo && (
          <div className="text-right md:border-l md:border-purple-800/50 md:pl-6">
            <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase block mb-1 flex items-center justify-end gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>LATEST ACTIVE SCROLL:</span>
            </span>
            <a
              href={stats.recentRepo.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-white hover:text-cyan-300 transition-colors inline-block"
            >
              {stats.recentRepo.name} ↗
            </a>
            <span className="text-xs text-slate-400 block font-mono mt-0.5">
              Updated: {new Date(stats.recentRepo.updated_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

