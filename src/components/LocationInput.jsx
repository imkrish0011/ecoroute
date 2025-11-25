import React, { useState, useEffect, useRef } from 'react';
import { searchLocation, reverseGeocode } from '../services/geocodingAPI';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

const LocationInput = ({ label, onLocationSelect, placeholder, initialValue }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (initialValue) {
            setQuery(initialValue);
        }
    }, [initialValue]);

    const handleSearch = async (value) => {
        setQuery(value);
        if (value.length > 2) {
            setLoading(true);
            try {
                const results = await searchLocation(value);
                setSuggestions(results);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelect = (location) => {
        setQuery(location.display_name);
        setShowSuggestions(false);
        onLocationSelect({
            name: location.display_name,
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lon)
        });
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const data = await reverseGeocode(latitude, longitude);
                    const name = data ? data.display_name : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    setQuery(name);
                    onLocationSelect({
                        name: name,
                        lat: latitude,
                        lng: longitude
                    });
                } catch (e) {
                    console.error("Reverse geocode failed", e);
                    setQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    onLocationSelect({
                        name: "Current Location",
                        lat: latitude,
                        lng: longitude
                    });
                } finally {
                    setLoading(false);
                }
            }, (error) => {
                console.error("Geolocation error", error);
                setLoading(false);
                alert("Could not get your location. Please enable location services.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
            <div className="flex gap-2">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-[#3a3a3a] rounded-lg leading-5 bg-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => query.length > 2 && setShowSuggestions(true)}
                    />
                    {loading && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                        </div>
                    )}
                </div>
                <button
                    onClick={handleCurrentLocation}
                    className="inline-flex items-center px-3 py-2 border border-[#3a3a3a] shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-300 bg-[#2a2a2a] hover:bg-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-[#1a1a1a] transition-colors"
                    title="Use Current Location"
                >
                    <Navigation className="h-4 w-4" />
                </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-20 mt-1 w-full bg-[#2a2a2a] border border-[#3a3a3a] shadow-lg max-h-60 rounded-lg py-1 text-base overflow-auto focus:outline-none text-sm">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.place_id}
                            className="cursor-pointer select-none relative py-2 px-3 hover:bg-[#3a3a3a] text-white transition-colors border-b border-[#333] last:border-b-0"
                            onClick={() => handleSelect(suggestion)}
                        >
                            <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
                                <span className="truncate">{suggestion.display_name}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationInput;
