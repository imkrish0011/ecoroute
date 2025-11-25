import { useState } from 'react';
import HomePage from './components/HomePage';
import LocationInput from './components/LocationInput';
import Map from './components/Map';
import RouteCard from './components/RouteCard';
import { fetchRoutes } from './services/routingAPI';
import { shouldShowRoute } from './utils/impactMessages';
import { calculateCarbon } from './utils/carbonCalculator';
import { Loader2, MapPin } from 'lucide-react';

function App() {
    const [showHome, setShowHome] = useState(true);
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRoutes, setSelectedRoutes] = useState([]);

    const handleCalculateRoutes = async () => {
        if (!origin || !destination) {
            setError("Please select both origin and destination.");
            return;
        }

        setLoading(true);
        setError(null);
        setRoutes([]);

        try {
            const results = await fetchRoutes(
                [origin.lng, origin.lat],
                [destination.lng, destination.lat]
            );
            setRoutes(results);

            // Check if all failed
            const allFailed = results.every(r => r.error);
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

    // Filter routes based on distance and get recommended route
    const getFilteredRoutes = () => {
        if (!routes.length) return { recommended: [], other: [] };

        const validRoutes = routes.filter(route => {
            if (route.error || !route.data) return false;
            const distanceKm = route.data.summary.distance / 1000;
            return shouldShowRoute(route.type, distanceKm);
        });

        // Calculate carbon for each route and sort by emissions (lowest to highest)
        const routesWithCarbon = validRoutes.map(route => {
            const distanceKm = route.data.summary.distance / 1000;
            const carbon = calculateCarbon(distanceKm, route.type);
            return { ...route, carbon };
        });

        // Sort by carbon emissions (lowest first)
        const sortedRoutes = [...routesWithCarbon].sort((a, b) => a.carbon - b.carbon);

        // Get recommended (lowest carbon option) and others
        const recommended = sortedRoutes.length > 0 ? [sortedRoutes[0]] : [];
        const other = sortedRoutes.slice(1);

        return { recommended, other };
    };

    const { recommended, other } = getFilteredRoutes();
    const drivingRoute = routes.find(r => r.type === 'driving-car' && r.data);

    // Toggle route selection
    const handleRouteSelect = (route) => {
        setSelectedRoutes(prev => {
            const isSelected = prev.some(r => r.type === route.type);
            if (isSelected) {
                return prev.filter(r => r.type !== route.type);
            } else {
                return [...prev, route];
            }
        });
    };

    // Show HomePage first
    if (showHome) {
        return <HomePage onGetStarted={() => setShowHome(false)} />;
    }

    return (
        <div className="flex flex-col h-screen bg-[#1a1a1a] md:flex-row">
            {/* Sidebar / Control Panel */}
            <div className="w-full md:w-[420px] p-6 bg-[#1a1a1a] z-10 overflow-y-auto flex flex-col h-full border-r border-[#2a2a2a]">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-8 h-8 text-green-500" />
                        <h1 className="text-3xl font-bold text-white">EcoRoute</h1>
                    </div>
                    <p className="text-gray-400 text-sm">Find the greenest way to go.</p>
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
                {(recommended.length > 0 || other.length > 0) && (
                    <div className="flex-grow">
                        {/* Recommended Section */}
                        {recommended.length > 0 && (
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-white text-xs font-bold uppercase tracking-wider">RECOMMENDED</h2>
                                    <span className="text-green-500 text-xs font-semibold">Best for Planet</span>
                                </div>
                                {recommended.map((route, idx) => (
                                    <RouteCard
                                        key={idx}
                                        route={route}
                                        drivingRoute={drivingRoute}
                                        isRecommended={true}
                                        isSelected={selectedRoutes.some(r => r.type === route.type)}
                                        onSelect={() => handleRouteSelect(route)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Other Routes */}
                        {other.length > 0 && (
                            <div>
                                {recommended.length > 0 && (
                                    <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
                                        OTHER OPTIONS
                                    </h2>
                                )}
                                {other.map((route, idx) => (
                                    <RouteCard
                                        key={idx}
                                        route={route}
                                        drivingRoute={drivingRoute}
                                        isRecommended={false}
                                        isSelected={selectedRoutes.some(r => r.type === route.type)}
                                        onSelect={() => handleRouteSelect(route)}
                                    />
                                ))}
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
                <Map origin={origin} destination={destination} routes={routes.filter(r => r.data)} selectedRoutes={selectedRoutes} />
            </div>
        </div>
    );
}

export default App;


