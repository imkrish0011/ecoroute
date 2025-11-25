import React from 'react';
import RouteCard from './RouteCard';
import { getRouteRecommendations } from '../utils/routeLogic';

const RouteComparison = ({ routes }) => {
    if (!routes || routes.length === 0) return null;

    // Find driving route for comparison
    const drivingRoute = routes.find(r => r.type === 'driving-car');

    // Get distance from driving route (or first available) to apply logic
    const referenceRoute = drivingRoute || routes[0];
    const distanceKm = referenceRoute && referenceRoute.data ? referenceRoute.data.summary.distance / 1000 : 0;

    const recommendations = getRouteRecommendations(distanceKm);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Route Options</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {routes.map((route, index) => {
                    if (route.error) return null; // Skip failed routes or handle them differently

                    const rec = recommendations[route.type];
                    if (!rec || !rec.show) return null;

                    return (
                        <RouteCard
                            key={index}
                            route={route}
                            drivingRoute={drivingRoute}
                        />
                    );
                })}
            </div>

            {/* Show messages for hidden routes */}
            <div className="text-sm text-gray-500 mt-4 italic">
                {Object.entries(recommendations).map(([type, rec]) => {
                    if (!rec.show && rec.reason) {
                        return <p key={type}>* {type.replace('-', ' ')} not shown: {rec.reason}</p>;
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default RouteComparison;
