import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENROUTE_API_KEY;
const BASE_URL = 'https://api.openrouteservice.org/v2/directions';

/**
 * Calculate straight-line distance between two coordinates (Haversine formula)
 * @param {Array} coord1 - [lng, lat]
 * @param {Array} coord2 - [lng, lat]
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Earth's radius in km
    const lat1 = coord1[1] * Math.PI / 180;
    const lat2 = coord2[1] * Math.PI / 180;
    const deltaLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const deltaLng = (coord2[0] - coord1[0]) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

/**
 * Create synthetic route based on driving route
 * @param {Object} drivingRoute - The driving route data
 * @param {string} mode - Transport mode (bus, bike-motorcycle, airplane)
 * @returns {Object} Synthetic route object
 */
const createSyntheticRoute = (drivingRoute, mode) => {
    if (!drivingRoute) return null;

    const distance = drivingRoute.properties.summary.distance;
    const distanceKm = distance / 1000;
    let duration = drivingRoute.properties.summary.duration;

    // Adjust duration based on mode
    switch (mode) {
        case 'bus':
            duration = duration * 1.3; // Buses are ~30% slower due to stops
            break;
        case 'bike-motorcycle':
            duration = duration * 0.9; // Motorcycles are ~10% faster
            break;
        case 'airplane':
            // Flight time: distance/800 km/h + 2 hours for check-in/boarding/landing
            duration = (distanceKm / 800) * 3600 + 7200;
            break;
    }

    return {
        properties: {
            summary: {
                distance: distance,
                duration: duration
            }
        },
        geometry: {
            coordinates: drivingRoute.geometry.coordinates
        }
    };
};

export const fetchRoutes = async (start, end) => {
    if (!API_KEY) {
        throw new Error("API Key is missing. Please check your .env file.");
    }

    const profiles = ['foot-walking', 'cycling-regular', 'driving-car'];

    try {
        // Fetch real routes from API
        const requests = profiles.map(profile =>
            axios.post(`${BASE_URL}/${profile}/geojson`, {
                coordinates: [start, end], // [lng, lat]
                elevation: true
            }, {
                headers: {
                    'Authorization': API_KEY,
                    'Content-Type': 'application/json'
                }
            })
        );

        const responses = await Promise.allSettled(requests);

        const realRoutes = responses.map((response, index) => {
            const profile = profiles[index];
            if (response.status === 'fulfilled') {
                const data = response.value.data;
                const feature = data.features[0];
                return {
                    type: profile,
                    data: {
                        summary: feature.properties.summary,
                        coordinates: feature.geometry.coordinates
                    },
                    error: null
                };
            } else {
                return {
                    type: profile,
                    data: null,
                    error: response.reason.message || "Failed to fetch route"
                };
            }
        });

        // Get driving route for synthetic route generation
        const drivingRoute = responses[2].status === 'fulfilled'
            ? responses[2].value.data.features[0]
            : null;

        // Calculate straight-line distance for international detection
        const straightDistance = calculateDistance(start, end);
        const isLongDistance = straightDistance > 500; // >500km considered long distance

        // Create synthetic routes for bus, bike, and airplane
        const syntheticModes = [];

        // Only add bus if there's a driving route
        if (drivingRoute) {
            const busRoute = createSyntheticRoute(drivingRoute, 'bus');
            syntheticModes.push({
                type: 'bus',
                data: busRoute ? {
                    summary: busRoute.properties.summary,
                    coordinates: busRoute.geometry.coordinates
                } : null,
                error: busRoute ? null : "Could not generate bus route"
            });

            const bikeRoute = createSyntheticRoute(drivingRoute, 'bike-motorcycle');
            syntheticModes.push({
                type: 'bike-motorcycle',
                data: bikeRoute ? {
                    summary: bikeRoute.properties.summary,
                    coordinates: bikeRoute.geometry.coordinates
                } : null,
                error: bikeRoute ? null : "Could not generate bike route"
            });
        }

        // Add airplane for long distance/international travel
        if (isLongDistance && drivingRoute) {
            const airplaneRoute = createSyntheticRoute(drivingRoute, 'airplane');
            syntheticModes.push({
                type: 'airplane',
                data: airplaneRoute ? {
                    summary: airplaneRoute.properties.summary,
                    coordinates: [start, end] // Straight line for airplane
                } : null,
                error: airplaneRoute ? null : "Could not generate airplane route"
            });
        }

        return [...realRoutes, ...syntheticModes];

    } catch (error) {
        console.error("Error fetching routes:", error);
        throw error;
    }
};
