import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationInput from '../components/LocationInput';
import Map from '../components/Map';
import TrackerDashboard from '../components/TrackerDashboard';
import RouteComparison from '../components/RouteComparison';
import EcoScoreBreakdown from '../components/EcoScoreBreakdown';
import { fetchRoutes } from '../services/routingAPI';
import { calculateElevationGain } from '../utils/elevation';
import { estimateEmission } from '../utils/emissions';
import { useAuth } from '../hooks/useAuth';
import { saveEcoTrip } from '../services/ecoService';
import { Loader2, MapPin, LayoutDashboard } from 'lucide-react';

const MapPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);

    const handleCalculateRoutes = async () => {
        if (!origin || !destination) {
            setError("Please select both origin and destination.");
            return;
        }

        setLoading(true);
        setError(null);
        setRoutes([]);
        setSelectedRoute(null);

        try {
            const results = await fetchRoutes(
                [origin.lng, origin.lat],
                [destination.lng, destination.lat]
            );

            // Process routes with new metrics
            const processedRoutes = results.map((route, index) => {
                if (route.error || !route.data) return route;

                const distanceKm = route.data.summary.distance / 1000;
                const coordinates = route.data.coordinates;

                // Elevation
                const elevationGain = calculateElevationGain(coordinates);

                // CO2
                const co2 = estimateEmission(distanceKm, route.type);

                // Turns (approximate from coordinates count for now)
                const turnCount = Math.floor(coordinates.length / 10);

                // EcoScore Calculation
                const distancePenalty = distanceKm * 2;
                const elevationPenalty = elevationGain * 0.3;
                const turnsPenalty = turnCount * 0.5;

                let ecoScore = 100 - distancePenalty - elevationPenalty - turnsPenalty;
                ecoScore = Math.max(0, Math.min(100, ecoScore)); // Clamp 0-100

                return {
                    ...route,
                    id: `route-${index}`,
                    distanceKm: Number(distanceKm.toFixed(1)),
                    duration: formatDuration(route.data.summary.duration),
                    elevationGain,
                    co2,
                    ecoScore,
                    breakdown: {
                        baseScore: 100,
                        distancePenalty: Number(distancePenalty.toFixed(1)),
                        elevationPenalty: Number(elevationPenalty.toFixed(1)),
                        turnsPenalty: Number(turnsPenalty.toFixed(1))
                    }
                };
            });

            setRoutes(processedRoutes);

            // Check if all failed
            const allFailed = processedRoutes.every(r => r.error);
            if (allFailed) {
                setError("Could not find any routes between these locations.");
            }
        } catch (err) {
            setError("Failed to calculate routes. Please check your connection or API key.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.round((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}min`;
    };

    const handleRouteSelect = (route) => {
        setSelectedRoute(route);
    };

    const handleStartTrip = async () => {
        if (!selectedRoute || !currentUser) return;

        // Calculate savings against driving (assuming driving is ~150g/km)
        const drivingEmission = estimateEmission(selectedRoute.distanceKm, 'driving-car');
        const savings = Math.max(0, drivingEmission - selectedRoute.co2);

        try {
            await saveEcoTrip(currentUser.uid, {
                distanceKm: selectedRoute.distanceKm,
                co2Saved: savings,
                elevationGain: selectedRoute.elevationGain,
                ecoScore: selectedRoute.ecoScore,
                mode: selectedRoute.type // 'foot-walking', 'cycling-regular', etc.
            });
            alert(`Trip started! You're saving ${savings}g of CO2!`);
        } catch (error) {
            console.error("Failed to save trip", error);
            alert("Failed to save trip to cloud.");
        }
    };

    const validRoutes = routes.filter(r => !r.error && r.data);

    return (
        <div className="flex flex-col h-screen bg-[#1a1a1a] md:flex-row">
            {/* Sidebar / Control Panel */}
            <div className="w-full md:w-[450px] p-6 bg-[#1a1a1a] z-10 overflow-y-auto flex flex-col h-full border-r border-[#2a2a2a]">
                {/* Header */}
                <div className="mb-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-8 h-8 text-green-500" />
                            <h1 className="text-3xl font-bold text-white">EcoRoute</h1>
                        </div>
                        <p className="text-gray-400 text-sm">Find the greenest way to go.</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 bg-[#2a2a2a] rounded-lg text-gray-300 hover:text-white hover:bg-[#333] transition-colors"
                        title="View Dashboard"
                    >
                        <LayoutDashboard size={24} />
                    </button>
                </div>

                {/* Input Section */}
                <div className="space-y-3 mb-6">
                    <LocationInput
                        label="Origin"
                        placeholder="delhi, India"
                        onLocationSelect={setOrigin}
                        initialValue={origin ? origin.name : ''}
                    />
                    <LocationInput
                        label="Destination"
                        placeholder="Noida"
                        onLocationSelect={setDestination}
                        initialValue={destination ? destination.name : ''}
                    />

                    <button
                        onClick={handleCalculateRoutes}
                        disabled={loading || !origin || !destination}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Calculating...
                            </>
                        ) : (
                            <>
                                <MapPin className="h-5 w-5" />
                                Find Eco Routes
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm border border-red-500/30">
                            {error}
                        </div>
                    )}
                </div>

                {/* Routes Section */}
                {validRoutes.length > 0 && (
                    <div className="flex-grow space-y-6">
                        <RouteComparison
                            routes={validRoutes}
                            onSelect={handleRouteSelect}
                            selectedRouteId={selectedRoute?.id}
                        />

                        {selectedRoute && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <EcoScoreBreakdown breakdown={selectedRoute.breakdown} />

                                <button
                                    onClick={handleStartTrip}
                                    className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
                                >
                                    Start This Journey
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {routes.length === 0 && !loading && (
                    <div className="flex-grow flex items-center justify-center text-center">
                        <div className="text-gray-500">
                            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Enter origin and destination to find eco-friendly routes</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Map Area */}
            <div className="w-full md:flex-1 h-1/2 md:h-full relative">
                <Map
                    origin={origin}
                    destination={destination}
                    routes={validRoutes}
                    selectedRoutes={selectedRoute ? [selectedRoute] : []}
                />
            </div>
        </div>
    );
};

export default MapPage;
