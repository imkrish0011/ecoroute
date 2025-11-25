import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const RouteLayer = ({ routes, origin, destination }) => {
    const map = useMap();

    useEffect(() => {
        if ((origin || destination) && map) {
            const bounds = L.latLngBounds([]);
            if (origin) bounds.extend([origin.lat, origin.lng]);
            if (destination) bounds.extend([destination.lat, destination.lng]);

            if (routes && routes.length > 0) {
                routes.forEach(route => {
                    if (route.data && route.data.coordinates) {
                        // GeoJSON coordinates are [lng, lat], Leaflet needs [lat, lng]
                        const latLngs = route.data.coordinates.map(coord => [coord[1], coord[0]]);
                        bounds.extend(latLngs);
                    }
                });
            }

            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [routes, origin, destination, map]);

    return null;
};

const Map = ({ origin, destination, routes, selectedRoutes }) => {
    const getRouteColor = (type) => {
        switch (type) {
            case 'foot-walking': return '#4CAF50'; // Green
            case 'cycling-regular': return '#2196F3'; // Blue
            case 'bus': return '#FF9800'; // Orange
            case 'bike-motorcycle': return '#9C27B0'; // Purple
            case 'driving-car': return '#f44336'; // Red
            case 'airplane': return '#FFC107'; // Yellow
            default: return '#333';
        }
    };

    const center = origin ? [origin.lat, origin.lng] : [51.505, -0.09]; // Default to London or user loc

    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {origin && (
                <Marker position={[origin.lat, origin.lng]}>
                    <Popup>Origin: {origin.name}</Popup>
                </Marker>
            )}

            {destination && (
                <Marker position={[destination.lat, destination.lng]}>
                    <Popup>Destination: {destination.name}</Popup>
                </Marker>
            )}

            {routes && routes.map((route, index) => {
                if (!route.data || !route.data.coordinates) return null;
                // GeoJSON coordinates are [lng, lat], Leaflet needs [lat, lng]
                const positions = route.data.coordinates.map(coord => [coord[1], coord[0]]);

                // Determine opacity and weight based on selection
                const isSelected = selectedRoutes.some(r => r.type === route.type);
                const hasSelection = selectedRoutes.length > 0;
                const opacity = hasSelection ? (isSelected ? 1.0 : 0.3) : 0.7;
                const weight = isSelected ? 6 : 5;

                return (
                    <Polyline
                        key={index}
                        positions={positions}
                        pathOptions={{ color: getRouteColor(route.type), weight: weight, opacity: opacity }}
                    >
                        <Popup>
                            {route.type.replace('-', ' ')} <br />
                            {(route.data.summary.distance / 1000).toFixed(1)} km
                        </Popup>
                    </Polyline>
                );
            })}

            <RouteLayer routes={routes} origin={origin} destination={destination} />
        </MapContainer>
    );
};

export default Map;
