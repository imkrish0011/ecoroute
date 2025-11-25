import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ecoscore_carbon_tracker';

const INITIAL_STATE = {
    totalDistance: 0, // km
    totalCo2Saved: 0, // kg
    totalTrips: 0,
    streakDays: 0,
    lastTripDate: null,
    history: [] // { date, co2Saved } for last 30 days
};

export const useCarbonTracker = () => {
    const [stats, setStats] = useState(INITIAL_STATE);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setStats(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse carbon tracker data", e);
            }
        }
    }, []);

    const saveStats = (newStats) => {
        setStats(newStats);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    };

    const logTrip = (distanceKm, co2SavedKg) => {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = stats.lastTripDate ? stats.lastTripDate.split('T')[0] : null;

        let newStreak = stats.streakDays;

        if (today === lastDate) {
            // Same day, streak doesn't change (already counted)
        } else if (lastDate && isConsecutiveDay(lastDate, today)) {
            newStreak += 1;
        } else {
            newStreak = 1; // Reset or start new
        }

        // Update history (keep last 30 entries)
        const newHistory = [...stats.history, { date: today, co2Saved: co2SavedKg }];
        if (newHistory.length > 30) newHistory.shift();

        const newStats = {
            totalDistance: stats.totalDistance + distanceKm,
            totalCo2Saved: stats.totalCo2Saved + co2SavedKg,
            totalTrips: stats.totalTrips + 1,
            streakDays: newStreak,
            lastTripDate: new Date().toISOString(),
            history: newHistory
        };

        saveStats(newStats);
    };

    const isConsecutiveDay = (prevDateStr, currDateStr) => {
        const prev = new Date(prevDateStr);
        const curr = new Date(currDateStr);
        const diffTime = Math.abs(curr - prev);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1;
    };

    return {
        stats,
        logTrip
    };
};
