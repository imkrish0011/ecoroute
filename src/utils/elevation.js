/**
 * Calculates the total elevation gain (ascent) from a list of coordinates with elevation data.
 * @param {Array} coordinates - Array of [lng, lat, alt]
 * @returns {number} Total elevation gain in meters
 */
export const calculateElevationGain = (coordinates) => {
    if (!coordinates || coordinates.length < 2) return 0;

    let gain = 0;
    for (let i = 1; i < coordinates.length; i++) {
        const prevAlt = coordinates[i - 1][2] || 0;
        const currAlt = coordinates[i][2] || 0;
        const diff = currAlt - prevAlt;
        if (diff > 0) {
            gain += diff;
        }
    }
    return Math.round(gain);
};

/**
 * Calculates the average slope percentage.
 * @param {number} ascent - Total ascent in meters
 * @param {number} distanceKm - Total distance in kilometers
 * @returns {number} Average slope percentage
 */
export const calculateSlopePercent = (ascent, distanceKm) => {
    if (!distanceKm || distanceKm <= 0) return 0;
    const distanceMeters = distanceKm * 1000;
    return Number(((ascent / distanceMeters) * 100).toFixed(1));
};
