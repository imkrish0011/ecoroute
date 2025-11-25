import React from 'react';
import { MapPin, Leaf, Route, TrendingDown, Award, ArrowRight } from 'lucide-react';

const HomePage = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white overflow-y-auto">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10"></div>

                <div className="relative max-w-6xl mx-auto px-6 py-20">
                    {/* Logo & Title */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <MapPin className="w-12 h-12 text-green-500" />
                            <h1 className="text-5xl md:text-6xl font-bold">EcoRoute</h1>
                        </div>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
                            Find the greenest way to go. Every journey matters.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mb-20">
                        <button
                            onClick={onGetStarted}
                            className="group inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/50"
                        >
                            Start Your Eco Journey
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Mission Section */}
                    <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl p-8 md:p-12 mb-12">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Leaf className="w-8 h-8 text-green-500" />
                            Our Mission
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-4">
                            At EcoRoute, we believe that every journey has an environmental impact. Our mission is to empower travelers
                            with the knowledge and tools to make eco-conscious transportation choices that reduce carbon emissions and
                            protect our planet.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            We're committed to making sustainable travel accessible, transparent, and rewarding for everyone.
                            Together, we can create a greener future—one route at a time.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Feature 1 */}
                            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-6 hover:border-green-500/50 transition-all">
                                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                                    <Route className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Smart Route Comparison</h3>
                                <p className="text-gray-400">
                                    Compare walking, cycling, and driving routes side-by-side. We show you distance, time, and environmental impact for each option.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-6 hover:border-green-500/50 transition-all">
                                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                                    <TrendingDown className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Real-Time Carbon Tracking</h3>
                                <p className="text-gray-400">
                                    See exactly how much CO₂ each route produces. Understand your carbon savings compared to driving alone.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-6 hover:border-green-500/50 transition-all">
                                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                                    <Award className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Eco-Friendly Recommendations</h3>
                                <p className="text-gray-400">
                                    Get intelligent suggestions for the most sustainable routes. We filter out impractical options and highlight the best eco choices.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Eco-Friendly Travel?</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-green-500 mb-2">23%</div>
                                <p className="text-gray-400">of global CO₂ emissions come from transportation</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-green-500 mb-2">0kg</div>
                                <p className="text-gray-400">CO₂ emissions from cycling or walking</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-green-500 mb-2">50%</div>
                                <p className="text-gray-400">average CO₂ reduction by choosing cycling over driving</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer CTA */}
                    <div className="text-center mt-16">
                        <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
                        <p className="text-gray-400 mb-6">Join thousands of eco-conscious travelers making sustainable choices.</p>
                        <button
                            onClick={onGetStarted}
                            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105"
                        >
                            Get Started Now
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
