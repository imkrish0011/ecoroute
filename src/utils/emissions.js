/**
 * Estimates CO2 emissions for a given distance and mode.
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} mode - Transport mode
 * @returns {number} CO2 emissions in grams
 */
export const estimateEmission = (distanceKm, mode) => {
    const emissionRates = {
        'foot-walking': 0,
        'cycling-regular': 0,
        'bus': 50,          // 50g/km
        'bike-motorcycle': 100, // 100g/km
        'driving-car': 150,   // 150g/km (updated from user request)
        'airplane': 250,      // 250g/km
        'electric-car': 60    // 60 Wh/km -> roughly converted to emissions depending on grid, but user said 60Wh/km. 
        // Let's assume 0 direct emissions but maybe some lifecycle. 
        // User specified: "EV = 60 Wh/km". 
        // If we strictly follow "Static CO2 Estimation" request:
        // petrol = 150 g/km
        // bike/walk = 0 g/km
        // EV = 60 Wh/km (This is energy, not CO2. Assuming 0g tailpipe for now or converting? 
        // Let's stick to grams for the output. 
        // If the user wants EV comparison, we might need a conversion factor. 
        // For now, let's use the user's petrol value and keep others consistent.)
    };

    // EV handling if we add it later
    if (mode === 'electric-car') return 0; // Tailpipe

    const rate = emissionRates[mode] || 0;
    return Math.round(distanceKm * rate);
};

/**
 * Compares emissions between two routes.
 * @param {object} routeA - { distanceKm, mode }
 * @param {object} routeB - { distanceKm, mode }
 * @returns {object} { difference, savings, isGreenest }
 */
export const compareEmission = (routeA, routeB) => {
    const emissionA = estimateEmission(routeA.distanceKm, routeA.mode);
    const emissionB = estimateEmission(routeB.distanceKm, routeB.mode);

    const difference = Math.abs(emissionA - emissionB);
    const savings = Math.max(emissionA, emissionB) - Math.min(emissionA, emissionB);
    const greenest = emissionA < emissionB ? 'A' : 'B';

    return {
        difference,
        savings,
        greenest
    };
};
