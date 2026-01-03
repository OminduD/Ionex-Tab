// src/utils/themes.ts

export const themes: Record<string, { name: string; class: string; wallpaper: string; colors: string[] }> = {
    aurora: { name: 'Aurora', class: 'bg-gradient-to-br from-purple-600 to-blue-500', wallpaper: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop', colors: ['#9333ea', '#3b82f6', '#6366f1'] },
    sunset: { name: 'Sunset', class: 'bg-gradient-to-br from-amber-500 to-rose-600', wallpaper: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=2070&auto=format&fit=crop', colors: ['#f59e0b', '#f43f5e', '#e11d48'] },
    forest: { name: 'Forest', class: 'bg-gradient-to-br from-lime-600 to-emerald-700', wallpaper: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop', colors: ['#65a30d', '#059669', '#047857'] },
    ocean: { name: 'Ocean', class: 'bg-gradient-to-br from-sky-400 to-blue-700', wallpaper: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2026&auto=format&fit=crop', colors: ['#38bdf8', '#1d4ed8', '#0369a1'] },
    midnight: { name: 'Midnight', class: 'bg-gradient-to-br from-gray-900 to-violet-900', wallpaper: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop', colors: ['#a78bfa', '#7c3aed', '#8b5cf6'] },
    neon: { name: 'Neon', class: 'bg-gradient-to-br from-fuchsia-500 to-cyan-500', wallpaper: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2187&auto=format&fit=crop', colors: ['#d946ef', '#06b6d4', '#8b5cf6'] },
    cherry: { name: 'Cherry', class: 'bg-gradient-to-br from-pink-600 to-red-700', wallpaper: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=2070&auto=format&fit=crop', colors: ['#db2777', '#dc2626', '#be123c'] },
    mint: { name: 'Mint', class: 'bg-gradient-to-br from-teal-400 to-green-600', wallpaper: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop', colors: ['#2dd4bf', '#16a34a', '#14b8a6'] },
    cyberpunk: { name: 'Cyberpunk', class: 'bg-gradient-to-br from-fuchsia-600 to-cyan-600', wallpaper: '/assets/cyberpunk-theme.png', colors: ['#d946ef', '#06b6d4', '#f472b6'] },
};
