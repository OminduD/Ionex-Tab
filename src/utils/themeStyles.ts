// src/utils/themeStyles.ts

interface ThemeStyle {
    button: {
        active: string;
        border: string;
        text: string;
        glow: string;
        ring: string;
    };
    aiButton: {
        text: string;
        border: string;
        shadow: string;
        glow: string;
    };
}

export const themeStyles: Record<string, ThemeStyle> = {
    cyberpunk: {
        button: {
            active: 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
            border: 'border-cyan-500/50',
            text: 'text-cyan-400',
            glow: 'group-hover:border-cyan-400',
            ring: 'border-cyan-500/50',
        },
        aiButton: {
            text: 'text-cyan-400',
            border: 'border-cyan-500/50',
            shadow: 'shadow-cyan-500/20',
            glow: 'bg-cyan-500',
        }
    },
    neon: {
        button: {
            active: 'bg-fuchsia-500/20 border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.4)]',
            border: 'border-fuchsia-500/50',
            text: 'text-fuchsia-400',
            glow: 'group-hover:border-fuchsia-400',
            ring: 'border-fuchsia-500/50',
        },
        aiButton: {
            text: 'text-fuchsia-400',
            border: 'border-fuchsia-500/50',
            shadow: 'shadow-fuchsia-500/20',
            glow: 'bg-fuchsia-500',
        }
    },
    nature: {
        button: {
            active: 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
            border: 'border-emerald-500/50',
            text: 'text-emerald-400',
            glow: 'group-hover:border-emerald-400',
            ring: 'border-emerald-500/50',
        },
        aiButton: {
            text: 'text-emerald-400',
            border: 'border-emerald-500/50',
            shadow: 'shadow-emerald-500/20',
            glow: 'bg-emerald-500',
        }
    },
    forest: {
        button: {
            active: 'bg-green-500/20 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]',
            border: 'border-green-500/50',
            text: 'text-green-400',
            glow: 'group-hover:border-green-400',
            ring: 'border-green-500/50',
        },
        aiButton: {
            text: 'text-green-400',
            border: 'border-green-500/50',
            shadow: 'shadow-green-500/20',
            glow: 'bg-green-500',
        }
    },
    sunset: {
        button: {
            active: 'bg-orange-500/20 border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]',
            border: 'border-orange-500/50',
            text: 'text-orange-400',
            glow: 'group-hover:border-orange-400',
            ring: 'border-orange-500/50',
        },
        aiButton: {
            text: 'text-orange-400',
            border: 'border-orange-500/50',
            shadow: 'shadow-orange-500/20',
            glow: 'bg-orange-500',
        }
    },
    cherry: {
        button: {
            active: 'bg-rose-500/20 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]',
            border: 'border-rose-500/50',
            text: 'text-rose-400',
            glow: 'group-hover:border-rose-400',
            ring: 'border-rose-500/50',
        },
        aiButton: {
            text: 'text-rose-400',
            border: 'border-rose-500/50',
            shadow: 'shadow-rose-500/20',
            glow: 'bg-rose-500',
        }
    },
    ocean: {
        button: {
            active: 'bg-blue-500/20 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]',
            border: 'border-blue-500/50',
            text: 'text-blue-400',
            glow: 'group-hover:border-blue-400',
            ring: 'border-blue-500/50',
        },
        aiButton: {
            text: 'text-blue-400',
            border: 'border-blue-500/50',
            shadow: 'shadow-blue-500/20',
            glow: 'bg-blue-500',
        }
    },
    aurora: {
        button: {
            active: 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]',
            border: 'border-indigo-500/50',
            text: 'text-indigo-400',
            glow: 'group-hover:border-indigo-400',
            ring: 'border-indigo-500/50',
        },
        aiButton: {
            text: 'text-indigo-400',
            border: 'border-indigo-500/50',
            shadow: 'shadow-indigo-500/20',
            glow: 'bg-indigo-500',
        }
    },
    midnight: {
        button: {
            active: 'bg-violet-500/20 border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.4)]',
            border: 'border-violet-500/50',
            text: 'text-violet-400',
            glow: 'group-hover:border-violet-400',
            ring: 'border-violet-500/50',
        },
        aiButton: {
            text: 'text-violet-400',
            border: 'border-violet-500/50',
            shadow: 'shadow-violet-500/20',
            glow: 'bg-violet-500',
        }
    },
};

export const getThemeStyles = (theme: string): ThemeStyle => {
    return themeStyles[theme] || themeStyles['cyberpunk'];
};
