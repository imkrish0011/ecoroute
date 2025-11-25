/**
 * Calculates carbon emissions for a given distance and mode of transport.
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} mode - Mode of transport
 * @returns {number} Carbon emissions in kg
 */
export const calculateCarbon = (distanceKm, mode) => {
    const emissionRates = {
        'foot-walking': 0,           // 0 kg CO2/km - zero emissions
        'cycling-regular': 0,         // 0 kg CO2/km - zero emissions
        'bus': 0.05,                  // 50g/km = 0.05kg/km - most efficient motorized option
        'bike-motorcycle': 0.1,       // 100g/km = 0.1kg/km - half of car emissions
        'driving-car': 0.2,           // 200g/km = 0.2kg/km - standard car
        'airplane': 0.25,             // 250g/km = 0.25kg/km - highest emissions but necessary for long/international
    };

    const rate = emissionRates[mode] || 0;
    return Number((distanceKm * rate).toFixed(2));
};

/**
 * Calculates carbon savings compared to driving.
 * @param {number} drivingCarbon - Carbon emissions from driving in kg
 * @param {number} modeCarbon - Carbon emissions from the specific mode in kg
 * @returns {number} Carbon savings in kg
 */
export const calculateSavings = (drivingCarbon, modeCarbon) => {
    return Number((drivingCarbon - modeCarbon).toFixed(2));
};

/**
 * Returns a fun equivalent for the saved carbon.
 * @param {number} savingsKg - Carbon savings in kg
 * @returns {string} Equivalent string
 */
export const getCarbonEquivalent = (savingsKg) => {
    if (savingsKg <= 0) return null;

    // 1 smartphone charge = ~0.005 kg CO2 (very rough estimate)
    // 1 tree absorbs ~22kg CO2 per year -> ~0.06kg per day

    const smartphones = Math.round(savingsKg / 0.005);
    if (smartphones < 10) {
        return `Equivalent to charging ${smartphones} smartphones!`;
    }

    const treeDays = (savingsKg / 0.06).toFixed(1);
    if (Number(treeDays) >= 1) {
        return `Like a tree breathing for ${treeDays} days!`;
    }

    return `Equivalent to charging ${smartphones} smartphones!`;
};
