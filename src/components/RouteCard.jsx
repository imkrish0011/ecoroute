import React from 'react';
import { calculateCarbon, calculateSavings } from '../utils/carbonCalculator';
import { getImpactMessage, getRecommendationBadge } from '../utils/impactMessages';
import { Footprints, Bike, Car, Bus, Plane } from 'lucide-react';

const RouteCard = ({ route, drivingRoute, isRecommended, isSelected, onSelect }) => {
    if (!route.data) return null;

    const { summary } = route.data;
    const distanceKm = (summary.distance / 1000).toFixed(1);
    const durationHours = Math.floor(summary.duration / 3600);
    const durationMins = Math.round((summary.duration % 3600) / 60);

    const carbon = calculateCarbon(distanceKm, route.type);
    const drivingCarbon = drivingRoute && drivingRoute.data
        ? calculateCarbon((drivingRoute.data.summary.distance / 1000), 'driving-car')
        : carbon;

    const savings = calculateSavings(drivingCarbon, carbon);
    const impactMessage = getImpactMessage(savings, route.type);
    const badge = getRecommendationBadge(route.type, savings);

    const isDriving = route.type === 'driving-car';
    const isEco = route.type === 'foot-walking' || route.type === 'cycling-regular' || route.type === 'bus';

    const getIcon = (type) => {
        const iconClass = "w-7 h-7";
        switch (type) {
            case 'foot-walking': return <Footprints className={iconClass} />;
            case 'cycling-regular': return <Bike className={iconClass} />;
            case 'bus': return <Bus className={iconClass} />;
            case 'bike-motorcycle': return <Bike className={iconClass} strokeWidth={2.5} />;
            case 'driving-car': return <Car className={iconClass} />;
            case 'airplane': return <Plane className={iconClass} />;
            default: return <Footprints className={iconClass} />;
        }
    };

    const getTitle = (type) => {
        switch (type) {
            case 'foot-walking': return 'Walking';
            case 'cycling-regular': return 'Cycling';
            case 'bus': return 'Bus';
            case 'bike-motorcycle': return 'Motorcycle';
            case 'driving-car': return 'Driving';
            case 'airplane': return 'Flight';
            default: return 'Route';
        }
    };

    const getRouteName = (type) => {
        switch (type) {
            case 'foot-walking': return 'Via Pedestrian Route';
            case 'cycling-regular': return 'Via Bike Lane';
            case 'bus': return 'Via Public Transit';
            case 'bike-motorcycle': return 'Via Highway';
            case 'driving-car': return 'Via Main Road';
            case 'airplane': return 'Direct Flight';
            default: return 'Via Main Route';
        }
    };

    const formatDuration = () => {
        if (durationHours > 0) {
            return `${durationHours} hr ${durationMins.toString().padStart(2, '0')} min`;
        }
        return `${durationMins} min`;
    };

    return (
        <div
            className={`
      relative bg-[#2a2a2a] rounded-xl p-4 mb-3 border border-[#3a3a3a]
      transition-all duration-200 hover:border-[#4a4a4a] cursor-pointer
      ${isRecommended ? 'border-green-500/30' : ''}
      ${isSelected ? 'ring-2 ring-green-500' : ''}
    `}
            onClick={onSelect}
        >
            {/* Top Badge */}
            {badge && isRecommended && (
                <div className="absolute -top-0 right-3 bg-green-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-b-md">
                    {badge.text}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <div className={`
          p-2.5 rounded-full
          ${isEco ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-300'}
        `}>
                    {getIcon(route.type)}
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-bold text-lg leading-tight">{getTitle(route.type)}</h3>
                    <p className="text-gray-400 text-xs">{getRouteName(route.type)}</p>
                </div>
                <div className="text-right">
                    <div className="text-white font-bold text-xl">{formatDuration()}</div>
                    <div className="text-gray-500 text-xs">{distanceKm} km</div>
                </div>
            </div>

            {/* Carbon Metrics */}
            <div className="grid grid-cols-2 gap-2">
                {/* CO2 Emitted */}
                <div className={`
          p-3 rounded-lg border
          ${isDriving
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-green-500/10 border-green-500/30'
                    }
        `}>
                    <div className="text-gray-400 text-[10px] font-medium mb-1">
                        CO<sub>2</sub> Emitted
                    </div>
                    <div className={`
            font-bold text-lg flex items-baseline gap-1
            ${isDriving ? 'text-red-400' : 'text-green-400'}
          `}>
                        {carbon}
                        <span className="text-xs font-normal">kg</span>
                        {isEco && <span className="text-green-500 text-sm ml-1">🌿</span>}
                    </div>
                </div>

                {/* You Save */}
                {!isDriving && (
                    <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
                        <div className="text-gray-400 text-[10px] font-medium mb-1">You Save</div>
                        <div className="text-green-400 font-bold text-lg flex items-baseline gap-1">
                            {savings}
                            <span className="text-xs font-normal">kg</span>
                        </div>
                    </div>
                )}

                {/* No Savings for Driving */}
                {isDriving && (
                    <div className="bg-gray-800/50 border border-gray-700 p-3 rounded-lg">
                        <div className="text-gray-500 text-[10px] font-medium mb-1">Savings</div>
                        <div className="text-gray-500 font-medium text-sm">No Savings</div>
                    </div>
                )}
            </div>

            {/* Impact Message */}
            {impactMessage && !isDriving && (
                <div className="mt-3 flex items-start gap-2 text-xs text-green-400 bg-green-500/5 p-2 rounded-lg border border-green-500/20">
                    <span className="text-green-500">🌱</span>
                    <span>{impactMessage}</span>
                </div>
            )}

            {/* Negative Feedback for Driving */}
            {isDriving && (
                <div className="mt-3 flex items-start gap-2 text-xs text-gray-500">
                    <span>⚠️</span>
                    <span>High environmental impact. Consider a greener option.</span>
                </div>
            )}
        </div>
    );
};

export default RouteCard;
