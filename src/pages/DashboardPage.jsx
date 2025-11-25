import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, TrendingUp, Award, Calendar, Wind, Droplets, TreePine, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getUserStats, getRecentTrips } from '../services/ecoService';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                const userStats = await getUserStats(currentUser.uid);
                const recentTrips = await getRecentTrips(currentUser.uid);

                const graphData = recentTrips.map(t => ({
                    date: t.timestamp,
                    co2Saved: t.co2Saved
                })).reverse();

                setStats(userStats || {
                    totalDistance: 0,
                    totalCo2Saved: 0,
                    streakDays: 0,
                    totalTrips: 0
                });
                setHistory(graphData);
            }
            setLoading(false);
        };

        fetchData();
    }, [currentUser]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading stats...</div>;
    }

    const { totalDistance, totalCo2Saved, streakDays } = stats;
    const maxSaved = history.length > 0 ? Math.max(...history.map(h => h.co2Saved)) : 1;

    // Calculate trees saved (approx 20kg CO2 per year per tree)
    const treesSaved = (totalCo2Saved / 20000).toFixed(2);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 text-white p-6 md:p-12 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
                    <button
                        onClick={() => navigate('/app')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Back to Map
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                            {currentUser?.photoURL ? (
                                <img src={currentUser.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
                            ) : (
                                <User size={16} />
                            )}
                            <span>{currentUser?.displayName || currentUser?.email}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                            Your Eco Impact.
                        </h2>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            Every step counts. Here is the real-time impact of your sustainable choices synced to the cloud.
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-green-900/20">
                        <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping opacity-75"></div>
                            <Wind size={48} className="text-green-400 relative z-10" />
                        </div>
                        <div className="text-6xl font-bold text-white mb-2">
                            {(totalCo2Saved / 1000).toFixed(2)}<span className="text-2xl text-gray-400">kg</span>
                        </div>
                        <div className="text-green-400 font-medium uppercase tracking-wider text-sm">CO₂ Emissions Prevented</div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <StatCard
                        icon={<TrendingUp size={24} />}
                        label="Green Distance"
                        value={`${totalDistance.toFixed(1)} km`}
                        color="blue"
                        delay="0"
                    />
                    <StatCard
                        icon={<Award size={24} />}
                        label="Current Streak"
                        value={`${streakDays} days`}
                        color="orange"
                        delay="100"
                    />
                    <StatCard
                        icon={<TreePine size={24} />}
                        label="Trees Equivalent"
                        value={`${treesSaved} trees`}
                        color="emerald"
                        delay="200"
                    />
                </div>

                {/* Graph Section */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="flex items-center gap-3 mb-8">
                        <Calendar className="text-green-400" />
                        <h3 className="text-xl font-bold">Recent Activity</h3>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4">
                        {history.map((entry, index) => {
                            const heightPercent = maxSaved > 0 ? (entry.co2Saved / maxSaved) * 100 : 0;
                            const date = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' });

                            return (
                                <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
                                    <div className="w-full relative flex-1 flex items-end justify-center">
                                        <div
                                            className="w-full max-w-[40px] bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all duration-500 hover:shadow-[0_0_20px_rgba(74,222,128,0.5)]"
                                            style={{ height: `${Math.max(heightPercent, 5)}%` }}
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur text-white text-xs px-3 py-1 rounded-lg border border-white/10 whitespace-nowrap transition-opacity">
                                                {entry.co2Saved >= 1000 ? `${(entry.co2Saved / 1000).toFixed(2)}kg` : `${entry.co2Saved}g`} Saved
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-400 mt-4 font-medium">{date}</span>
                                </div>
                            );
                        })}
                        {history.length === 0 && (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                No activity recorded yet. Start your first eco-journey!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color, delay }) => {
    const colors = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    };

    return (
        <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-transform hover:-translate-y-1 duration-300 ${colors[color]}`}>
            <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 rounded-xl bg-white/5`}>
                    {icon}
                </div>
                <span className="text-gray-300 font-medium">{label}</span>
            </div>
            <div className="text-3xl font-bold text-white pl-1">{value}</div>
        </div>
    );
};

export default DashboardPage;
