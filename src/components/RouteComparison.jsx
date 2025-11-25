import React from 'react';
import { MapPin, Mountain, Wind, ArrowRight } from 'lucide-react';
import CircleProgress from './CircleProgress';

const RouteComparison = ({ routes, onSelect, selectedRouteId }) => {
    if (!routes || routes.length === 0) return null;

    // Find best metrics
    const minDistance = Math.min(...routes.map(r => r.distanceKm));
    const minCo2 = Math.min(...routes.map(r => r.co2));
    const maxScore = Math.max(...routes.map(r => r.ecoScore));

    return (
        <div className="space-y-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
                <ArrowRight className="text-green-500" />
                Route Options
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {routes.map((route, idx) => {
                    const isGreenest = route.co2 === minCo2;
                    const isShortest = route.distanceKm === minDistance;
                    const isBestScore = route.ecoScore === maxScore;
                    const isSelected = selectedRouteId === route.id;

                    return (
                        <div
                            key={idx}
                            onClick={() => onSelect(route)}
                            className={`relative p-4 rounded-xl border transition-all cursor-pointer ${isSelected
                                ? 'bg-[#2a2a2a] border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                                : 'bg-[#1a1a1a] border-[#333] hover:border-gray-500'
                                }`}
                        >
                            {/* Badges */}
                            <div className="absolute -top-3 left-4 flex gap-2">
                                {isGreenest && (
                                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                                        Greenest
                                    </span>
                                )}
                                {isShortest && !isGreenest && (
                                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                                        Shortest
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-white font-bold capitalize">{route.type.replace('-', ' ')}</span>
                                        <span className="text-gray-500 text-sm">• {route.duration}</span>
                                    </div>

                                    <div className="flex gap-4 text-sm text-gray-400 mt-2">
                                        <div className="flex items-center gap-1" title="Distance">
                                            <MapPin size={14} />
                                            {route.distanceKm} km
                                        </div>
                                        <div className="flex items-center gap-1" title="Elevation Gain">
                                            <Mountain size={14} />
                                            {route.elevationGain}m
                                        </div>
                                        <div className="flex items-center gap-1" title="CO2 Emissions">
                                            <Wind size={14} />
                                            {route.co2}g
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-1">
                                    <CircleProgress score={route.ecoScore} size={48} strokeWidth={3} />
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">EcoScore</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RouteComparison;
