import { db } from '../firebaseConfig';
import {
    collection,
    addDoc,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    query,
    where,
    orderBy,
    limit,
    getDocs
} from 'firebase/firestore';

/**
 * Saves a new eco trip to Firestore and updates user aggregates.
 * @param {string} uid - User ID
 * @param {object} tripData - { distanceKm, co2Saved, elevationGain, ecoScore, mode }
 */
export const saveEcoTrip = async (uid, tripData) => {
    try {
        const timestamp = new Date().toISOString();

        // 1. Add trip to 'trips' subcollection
        const tripsRef = collection(db, 'users', uid, 'trips');
        await addDoc(tripsRef, {
            ...tripData,
            timestamp: timestamp
        });

        // 2. Update aggregate stats
        const statsRef = doc(db, 'users', uid, 'stats', 'aggregate');
        const statsSnap = await getDoc(statsRef);

        if (!statsSnap.exists()) {
            // Initialize if first time
            await setDoc(statsRef, {
                totalDistance: tripData.distanceKm,
                totalCo2Saved: tripData.co2Saved,
                totalTrips: 1,
                lastTripDate: timestamp,
                streakDays: 1,
                elevationAvoided: tripData.elevationGain || 0 // Assuming gain is what we tracked, or avoided?
            });
        } else {
            // Update existing
            const currentStats = statsSnap.data();
            const lastDate = currentStats.lastTripDate ? currentStats.lastTripDate.split('T')[0] : null;
            const today = timestamp.split('T')[0];

            let newStreak = currentStats.streakDays || 0;
            if (lastDate !== today) {
                if (isConsecutiveDay(lastDate, today)) {
                    newStreak += 1;
                } else {
                    newStreak = 1;
                }
            }

            await updateDoc(statsRef, {
                totalDistance: increment(tripData.distanceKm),
                totalCo2Saved: increment(tripData.co2Saved),
                totalTrips: increment(1),
                lastTripDate: timestamp,
                streakDays: newStreak,
                elevationAvoided: increment(tripData.elevationGain || 0)
            });
        }

        return true;
    } catch (error) {
        console.error("Error saving eco trip:", error);
        throw error;
    }
};

/**
 * Fetches user's aggregate stats.
 * @param {string} uid 
 */
export const getUserStats = async (uid) => {
    try {
        const statsRef = doc(db, 'users', uid, 'stats', 'aggregate');
        const statsSnap = await getDoc(statsRef);

        if (statsSnap.exists()) {
            return statsSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return null;
    }
};

/**
 * Fetches recent trips for the graph/history.
 * @param {string} uid 
 * @param {number} limitCount 
 */
export const getRecentTrips = async (uid, limitCount = 7) => {
    try {
        const tripsRef = collection(db, 'users', uid, 'trips');
        const q = query(tripsRef, orderBy('timestamp', 'desc'), limit(limitCount));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching recent trips:", error);
        return [];
    }
};

// Helper for streak calculation
const isConsecutiveDay = (prevDateStr, currDateStr) => {
    const prev = new Date(prevDateStr);
    const curr = new Date(currDateStr);
    const diffTime = Math.abs(curr - prev);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
};
