// Environmental impact message generator
export const getImpactMessage = (carbonSaved, routeType) => {
    // Positive messages based on carbon saved
    if (carbonSaved > 0) {
        if (carbonSaved >= 100) {
            const trees = Math.round(carbonSaved / 0.06); // A tree absorbs ~0.06kg CO2/day
            return `Like ${trees} trees breathing for a day! 🌳`;
        } else if (carbonSaved >= 50) {
            const days = Math.round(carbonSaved / 0.06);
            return `Like a tree breathing for ${days} days! 🌱`;
        } else if (carbonSaved >= 20) {
            const bottles = Math.round(carbonSaved / 0.082); // ~0.082kg CO2 per plastic bottle
            return `Equivalent to ${bottles} plastic bottles not produced! ♻️`;
        } else if (carbonSaved >= 10) {
            const days = Math.round(carbonSaved / 0.06);
            return `Like a tree breathing for ${days} days! 🌿`;
        } else if (carbonSaved >= 5) {
            return `Small steps make big differences! 🌍`;
        } else {
            return `Every bit counts for our planet! 💚`;
        }
    }

    return null;
};

// Get ecological equivalence message
export const getEcoEquivalence = (carbonSaved) => {
    if (carbonSaved >= 100) {
        const trees = Math.round(carbonSaved * 16.67); // 1kg CO2 = ~16.67 days of tree absorption
        return `Saves ${trees} tree-days of carbon absorption`;
    } else if (carbonSaved >= 50) {
        const miles = Math.round(carbonSaved / 0.411); // 1 mile driven = ~0.411kg CO2
        return `Equal to not driving ${miles} miles`;
    } else if (carbonSaved >= 20) {
        const phones = Math.round(carbonSaved / 0.008); // Charging phone = ~0.008kg CO2
        return `Equal to ${phones} smartphone charges`;
    } else if (carbonSaved >= 5) {
        const hours = Math.round(carbonSaved / 0.155); // 1 hour laptop use = ~0.155kg CO2
        return `Equal to ${hours} hours of laptop use`;
    }

    return null;
};

// Get negative feedback for bad choices
export const getNegativeFeedback = (carbonEmitted, baselineCarbon) => {
    const percentageWorse = ((carbonEmitted - baselineCarbon) / baselineCarbon) * 100;

    if (percentageWorse > 50) {
        return {
            message: "⚠️ Environment Impact: Very High",
            severity: "critical"
        };
    } else if (percentageWorse > 20) {
        return {
            message: "⚠️ Environment Impact: High",
            severity: "high"
        };
    } else if (percentageWorse > 0) {
        return {
            message: "Consider a greener option",
            severity: "moderate"
        };
    }

    return null;
};

// Determine if route should be shown based on distance
export const shouldShowRoute = (routeType, distanceKm) => {
    switch (routeType) {
        case 'foot-walking':
            return distanceKm <= 3; // Only show walking for distances ≤ 3km
        case 'cycling-regular':
            return distanceKm <= 5; // Only show cycling for distances ≤ 5km
        case 'bus':
            return distanceKm >= 2; // Buses available for any distance ≥2km (not practical for very short)
        case 'bike-motorcycle':
            return distanceKm >= 5 && distanceKm <= 200; // Motorcycles for 5-200km
        case 'driving-car':
            return true; // Cars available for any distance
        case 'airplane':
            return distanceKm > 500; // Only show airplane for long distance
        default:
            return true;
    }
};

// Get recommendation badge
export const getRecommendationBadge = (routeType, carbonSaved) => {
    if (routeType === 'foot-walking' && carbonSaved > 0) {
        return {
            text: "100% Eco",
            color: "green"
        };
    } else if (routeType === 'cycling-regular' && carbonSaved > 0) {
        return {
            text: "100% Eco",
            color: "green"
        };
    } else if (routeType === 'bus' && carbonSaved > 0) {
        return {
            text: "Eco Choice",
            color: "green"
        };
    }

    return null;
};
