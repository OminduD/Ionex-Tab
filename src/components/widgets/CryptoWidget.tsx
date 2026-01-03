import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface CryptoWidgetProps {
    coins?: string[];
    theme: string;
    size?: 'small' | 'medium' | 'large';
}

interface CoinData {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
}

const CryptoWidget: React.FC<CryptoWidgetProps> = ({ coins = ['bitcoin', 'ethereum'], theme: _theme, size: _size = 'medium' }) => {
    const [data, setData] = useState<CoinData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPrices = async () => {
            if (!coins.length) return;
            setLoading(true);
            try {
                // Using CoinGecko free API
                const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false`);
                const json = await response.json();
                setData(json);
            } catch (e) {
                console.error("Failed to fetch crypto prices", e);
            } finally {
                setLoading(false);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [coins]);

    return (
        <div className="h-full flex flex-col p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-white/10">
                        <DollarSign className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="font-bold text-white text-sm">Market</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                {loading && !data.length ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {data.map((coin) => (
                            <div key={coin.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={`https://assets.coingecko.com/coins/images/1/small/${coin.id}.png`}
                                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/20')}
                                            alt={coin.symbol}
                                            className="w-8 h-8 rounded-full shadow-md group-hover:scale-110 transition-transform"
                                        />
                                        {/* Rank Badge */}
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/10 rounded-full border border-black flex items-center justify-center">
                                            <div className={`w-1.5 h-1.5 rounded-full ${coin.price_change_percentage_24h >= 0 ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm uppercase tracking-wide">{coin.symbol}</div>
                                        <div className="text-[10px] text-slate-400 font-medium">{coin.name}</div>
                                    </div>
                                </div>

                                {/* Mini Sparkline Visualization (Simulated) */}
                                <div className="flex gap-0.5 items-end h-6 w-12 opacity-30 group-hover:opacity-60 transition-opacity">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 rounded-t-sm ${coin.price_change_percentage_24h >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                            style={{ height: `${Math.random() * 80 + 20}%` }}
                                        />
                                    ))}
                                </div>

                                <div className="text-right">
                                    <div className="font-mono text-sm text-white font-bold">${coin.current_price.toLocaleString()}</div>
                                    <div className={`text-[10px] flex items-center justify-end gap-1 font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                        {data.length === 0 && !loading && (
                            <div className="text-center text-slate-500 text-xs py-4">
                                No coins selected. Check settings.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CryptoWidget;
