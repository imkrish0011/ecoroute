/**
 * Filters and recommends transport modes based on distance.
 * @param {number} distanceKm - Distance in kilometers
 * @returns {Object} Recommendation object
 */
export const getRouteRecommendations = (distanceKm) => {
    let recommendations = {
        'foot-walking': { show: true, recommended: false, reason: null },
        'cycling-regular': { show: true, recommended: false, reason: null },
        'driving-car': { show: true, recommended: false, reason: null },
    };

    if (distanceKm <= 1) {
        recommendations['foot-walking'].recommended = true;
        recommendations['cycling-regular'].show = true; // Still show cycling
        recommendations['driving-car'].show = false;
        recommendations['driving-car'].reason = "Distance too short for driving";
    } else if (distanceKm <= 5) {
        recommendations['foot-walking'].show = true;
        recommendations['cycling-regular'].recommended = true;
        recommendations['driving-car'].show = true;
    } else if (distanceKm <= 15) {
        recommendations['foot-walking'].show = false;
        recommendations['foot-walking'].reason = "Too far for walking";
        recommendations['cycling-regular'].recommended = true;
        recommendations['driving-car'].show = true;
    } else {
        recommendations['foot-walking'].show = false;
        recommendations['foot-walking'].reason = "Too far for walking";
        recommendations['cycling-regular'].show = true;
        recommendations['driving-car'].recommended = true; // Or transit if we had it
    }

    return recommendations;
};
