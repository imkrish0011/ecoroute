import axios from 'axios';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export const searchLocation = async (query) => {
    try {
        const response = await axios.get(NOMINATIM_URL, {
            params: {
                q: query,
                format: 'json',
                limit: 5,
                addressdetails: 1
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching location:", error);
        throw error;
    }
};

export const reverseGeocode = async (lat, lng) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
                lat,
                lon: lng,
                format: 'json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error reverse geocoding:", error);
        return null;
    }
}
