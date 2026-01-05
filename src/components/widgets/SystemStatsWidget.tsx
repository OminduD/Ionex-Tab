import React, { useState, useEffect, memo } from 'react';
import { Activity, Cpu, Battery, BatteryCharging, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';
import { themes } from '../../utils/themes';

interface SystemStatsWidgetProps {
    theme: string;
    size?: 'small' | 'medium' | 'large';
}

const SystemStatsWidget: React.FC<SystemStatsWidgetProps> = ({ theme = 'aurora' }) => {
    const currentTheme = themes[theme] || themes.aurora;
    const primaryColor = currentTheme.colors[0];
    const secondaryColor = currentTheme.colors[1];
    const [cpuUsage, setCpuUsage] = useState(0);
    const [ramUsage, setRamUsage] = useState(0);
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isCharging, setIsCharging] = useState(false);

    // Simulate CPU and RAM fluctuation (reduced frequency for lower RAM usage)
    useEffect(() => {
        const interval = setInterval(() => {
            setCpuUsage(Math.floor(Math.random() * 30) + 10); // 10-40%
            setRamUsage(Math.floor(Math.random() * 20) + 40); // 40-60%
        }, 5000); // Increased from 2s to 5s
        return () => clearInterval(interval);
    }, []);

    // Get Battery Status
    useEffect(() => {
        const getBattery = async () => {
            if ('getBattery' in navigator) {
                try {
                    // @ts-ignore - navigator.getBattery is not in standard TS types yet
                    const battery = await navigator.getBattery();

                    const updateBattery = () => {
                        setBatteryLevel(Math.floor(battery.level * 100));
                        setIsCharging(battery.charging);
                    };

                    updateBattery();
                    battery.addEventListener('levelchange', updateBattery);
                    battery.addEventListener('chargingchange', updateBattery);

                    return () => {
                        battery.removeEventListener('levelchange', updateBattery);
                        battery.removeEventListener('chargingchange', updateBattery);
                    };
                } catch (e) {
                    console.log('Battery API not supported');
                }
            }
        };
        getBattery();
    }, []);

    const getBatteryIcon = () => {
        if (isCharging) return <BatteryCharging className="w-5 h-5 text-green-400" />;
        if (batteryLevel === null) return <Battery className="w-5 h-5" />;
        if (batteryLevel < 20) return <BatteryLow className="w-5 h-5 text-red-400" />;
        if (batteryLevel < 60) return <BatteryMedium className="w-5 h-5 text-yellow-400" />;
        return <BatteryFull className="w-5 h-5 text-green-400" />;
    };

    return (
        <div className="h-full w-full bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-3 flex flex-col justify-between overflow-hidden relative group">
            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/20 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/20 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20 rounded-br-lg" />

                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-pulse" style={{ color: primaryColor }} />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/80">SYS_DIAGNOSTICS</span>
                </div>
                <div className="text-[10px] font-mono text-white/40">V3.1.1</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-3 flex-1 relative z-10 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/40">

                {/* CPU Circular Stat */}
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-2 border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-white/10" />
                                <circle
                                    cx="20" cy="20" r="16"
                                    stroke={primaryColor}
                                    strokeWidth="3"
                                    fill="none"
                                    strokeDasharray={100}
                                    strokeDashoffset={100 - cpuUsage}
                                    className="transition-all duration-500"
                                />
                            </svg>
                            <Cpu className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                            <div className="text-[10px] text-white/50 uppercase tracking-wider">CPU_CORE</div>
                            <div className="text-sm font-bold text-white font-mono">{cpuUsage}%</div>
                        </div>
                    </div>
                    {/* Animated Activity Bar */}
                    <div className="flex gap-0.5 h-4 items-end">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1 bg-white/20 rounded-sm transition-all duration-300"
                                style={{
                                    height: `${Math.random() * 100}%`,
                                    backgroundColor: i < 3 ? primaryColor : 'rgba(255,255,255,0.2)'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* RAM Stat */}
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-2 border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-white/5 border border-white/10">
                            <div className="text-[10px] font-bold text-white">RAM</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-white/50 uppercase tracking-wider">MEMORY_ALLOC</div>
                            <div className="text-sm font-bold text-white font-mono">{ramUsage}%</div>
                        </div>
                    </div>
                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                        <div
                            className="h-full transition-all duration-500"
                            style={{ width: `${ramUsage}%`, backgroundColor: secondaryColor }}
                        />
                    </div>
                </div>

                {/* Battery Stat */}
                {batteryLevel !== null && (
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-2 border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded ${isCharging ? 'text-green-400 bg-green-400/10' : 'text-white/60 bg-white/5'}`}>
                                {getBatteryIcon()}
                            </div>
                            <div>
                                <div className="text-[10px] text-white/50 uppercase tracking-wider">PWR_CELL</div>
                                <div className="text-sm font-bold text-white font-mono">{batteryLevel}%</div>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1 h-3 rounded-sm transition-all ${i < (batteryLevel / 10) ? (batteryLevel < 20 ? 'bg-red-500' : 'bg-green-500') : 'bg-white/10'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 animate-[scan_3s_linear_infinite]" />
        </div>
    );
};

export default memo(SystemStatsWidget);
