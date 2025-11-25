import React from 'react';
import { Leaf, Award, TrendingUp, Calendar } from 'lucide-react';

const TrackerDashboard = ({ stats }) => {
    if (!stats) return null;

    const { totalDistance, totalCo2Saved, streakDays, history } = stats;

    // Calculate max value for graph scaling
    const maxSaved = history.length > 0 ? Math.max(...history.map(h => h.co2Saved)) : 1;

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a] text-white">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Leaf className="text-green-500" />
                Your Eco Impact
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#252525] p-4 rounded-lg border border-[#333]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/20 rounded-full text-green-500">
                            <Leaf size={20} />
                        </div>
                        <span className="text-gray-400 text-sm">Total CO₂ Saved</span>
                    </div>
                    <div className="text-2xl font-bold">{(totalCo2Saved / 1000).toFixed(2)} <span className="text-sm font-normal text-gray-500">kg</span></div>
                </div>

                <div className="bg-[#252525] p-4 rounded-lg border border-[#333]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-full text-blue-500">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-gray-400 text-sm">Green Distance</span>
                    </div>
                    <div className="text-2xl font-bold">{totalDistance.toFixed(1)} <span className="text-sm font-normal text-gray-500">km</span></div>
                </div>

                <div className="bg-[#252525] p-4 rounded-lg border border-[#333]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-500/20 rounded-full text-orange-500">
                            <Award size={20} />
                        </div>
                        <span className="text-gray-400 text-sm">Current Streak</span>
                    </div>
                    <div className="text-2xl font-bold">{streakDays} <span className="text-sm font-normal text-gray-500">days</span></div>
                </div>
            </div>

            {/* Weekly Graph */}
            <div className="bg-[#252525] p-4 rounded-lg border border-[#333]">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar size={16} className="text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-300">Last 7 Days Activity</h3>
                </div>

                <div className="flex items-end justify-between h-32 gap-2">
                    {history.slice(-7).map((entry, index) => {
                        const heightPercent = maxSaved > 0 ? (entry.co2Saved / maxSaved) * 100 : 0;
                        const date = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' });

                        return (
                            <div key={index} className="flex flex-col items-center flex-1 group">
                                <div className="relative w-full flex justify-center items-end h-full">
                                    <div
                                        className="w-full max-w-[30px] bg-green-600/50 hover:bg-green-500 rounded-t-sm transition-all duration-300"
                                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded border border-gray-700 whitespace-nowrap z-10">
                                            {entry.co2Saved}g
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 mt-2">{date}</span>
                            </div>
                        );
                    })}
                    {history.length === 0 && (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                            No activity yet. Start a trip!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackerDashboard;
