import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Github } from 'lucide-react';

interface GitHubWidgetProps {
    username?: string;
    theme: string;
    size?: 'small' | 'medium' | 'large';
}

type GitHubStats = {
    publicRepos: number;
    totalContributions: number;
    streak: number;
    fetchedAt?: number;
};

type CachedGitHubStats = {
    stats: GitHubStats;
    fetchedAt: number;
};

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;



const safeParseJson = <T,>(raw: string | null): T | null => {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
};





const GitHubWidget: React.FC<GitHubWidgetProps> = ({ username, theme: _theme, size: _size = 'medium' }) => {
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) return;

        const cacheKey = `ionex:githubStats:${username}`;
        const cached = safeParseJson<CachedGitHubStats>(localStorage.getItem(cacheKey));
        const cacheFresh = cached && (Date.now() - cached.fetchedAt) < CACHE_TTL_MS;
        if (cached?.stats) {
            setStats(cached.stats);
        }

        if (cacheFresh) {
            setError(null);
            return;
        }

        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch User Profile for Public Repos
                const profileResponse = await fetch(`https://api.github.com/users/${username}`);
                if (!profileResponse.ok) throw new Error('Failed to fetch profile');
                const profileData = await profileResponse.json();

                // 2. Fetch Contributions for Streak & Total
                const contribResponse = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
                if (!contribResponse.ok) throw new Error('Failed to fetch contributions');
                const contribData = await contribResponse.json();

                const contributions: { date: string; count: number }[] = contribData.contributions || [];
                const today = new Date().toISOString().split('T')[0];

                // Find today's index
                let todayIndex = contributions.findIndex((c) => c.date === today);
                if (todayIndex === -1) {
                    // Fallback: find the last date that is <= today
                    todayIndex = contributions.length - 1;
                    for (let i = contributions.length - 1; i >= 0; i--) {
                        if (contributions[i].date <= today) {
                            todayIndex = i;
                            break;
                        }
                    }
                }

                // Calculate Streak - count consecutive days with contributions ending at today or yesterday
                let streak = 0;
                
                // Start from today and work backwards
                let startIdx = todayIndex;
                
                // If today has no contributions, check if we should start from yesterday
                if (contributions[todayIndex]?.count === 0 && todayIndex > 0) {
                    // Start from yesterday instead
                    startIdx = todayIndex - 1;
                }
                
                // Count consecutive days with contributions going backwards
                for (let i = startIdx; i >= 0; i--) {
                    if (contributions[i].count > 0) {
                        streak++;
                    } else {
                        // Found a day with no contributions, streak ends
                        break;
                    }
                }

                // Calculate Last Year (Rolling 365 Days) - only count days up to and including today
                const pastContributions = contributions.filter((c) => c.date <= today);
                const last365 = pastContributions.slice(-365);
                const lastYearContribs = last365.reduce((acc: number, curr) => acc + curr.count, 0);

                const computed: GitHubStats = {
                    publicRepos: profileData.public_repos,
                    totalContributions: lastYearContribs,
                    streak: streak,
                    fetchedAt: Date.now(),
                };

                setStats(computed);
                localStorage.setItem(cacheKey, JSON.stringify({ stats: computed, fetchedAt: Date.now() } satisfies CachedGitHubStats));
            } catch (e) {
                const message = e instanceof Error ? e.message : 'Failed to fetch GitHub stats';
                console.error('GitHubWidget error:', e);
                setError(message);

                // Do not overwrite previously cached stats with zeros.
                setStats((prev) => prev ?? { publicRepos: 0, totalContributions: 0, streak: 0, fetchedAt: Date.now() });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [username]);

    if (!username) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center font-mono">
                <Github className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs">SET_USERNAME_IN_CONFIG</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-4 relative overflow-hidden bg-black/80 font-mono border border-green-500/20">
            {/* Terminal Header */}
            <div className="flex items-center justify-between mb-4 z-10 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-green-400 font-bold">gh_stats.exe</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-white/40">
                    <Activity className="w-3 h-3" />
                    <span>PID: {Math.floor(Math.random() * 9000) + 1000}</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center z-10">
                {loading && !stats ? (
                    <div className="space-y-2">
                        <div className="text-xs text-green-500 animate-pulse">&gt; ESTABLISHING_UPLINK...</div>
                        <div className="text-xs text-green-500/70 animate-pulse delay-75">&gt; AUTHENTICATING_USER...</div>
                        <div className="text-xs text-green-500/50 animate-pulse delay-150">&gt; DOWNLOADING_PACKETS...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {/* Public Repos */}
                        <div className="bg-green-500/5 rounded p-2 border border-green-500/20 relative group hover:bg-green-500/10 transition-colors col-span-2 flex items-center justify-between">
                            <div>
                                <div className="text-[9px] text-green-400/70 uppercase tracking-wider">Public Repos</div>
                                <div className="text-xl font-bold text-white font-mono">{stats?.publicRepos ?? 0}</div>
                            </div>
                            <div className="p-1.5 bg-green-500/10 rounded">
                                <Github className="w-4 h-4 text-green-400" />
                            </div>
                        </div>

                        {/* Contributions */}
                        <div className="bg-green-500/5 rounded p-2 border border-green-500/20 relative group hover:bg-green-500/10 transition-colors">
                            <div className="text-[9px] text-green-400/70 mb-1 uppercase tracking-wider">Contribs (Last Year)</div>
                            <div className="text-xl font-bold text-white font-mono">{stats?.totalContributions ?? 0}</div>
                        </div>

                        {/* Streak */}
                        <div className="bg-green-500/5 rounded p-2 border border-green-500/20 relative group hover:bg-green-500/10 transition-colors">
                            <div className="text-[9px] text-green-400/70 mb-1 uppercase tracking-wider">Current Streak</div>
                            <div className="text-xl font-bold text-green-400 font-mono flex items-center gap-1">
                                {stats?.streak ?? 0} <span className="text-xs text-green-500/50">days</span>
                            </div>
                        </div>

                        {error && (
                            <div className="col-span-2 text-[9px] text-green-400/60 border border-green-500/10 bg-green-500/5 rounded px-2 py-1">
                                &gt; WARN: {error.toUpperCase().replace(/\s+/g, '_')}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Matrix-like Background Effect */}
            <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-[8px] text-green-500 font-mono whitespace-nowrap"
                        style={{ left: `${i * 10}%`, top: -20 }}
                        animate={{ y: [0, 300] }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                    >
                        {Array.from({ length: 20 }).map(() => Math.random() > 0.5 ? '1' : '0').join('')}
                    </motion.div>
                ))}
            </div>

            {/* Scanline */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none animate-[scan_2s_linear_infinite]" />
        </div>
    );
};

export default GitHubWidget;
