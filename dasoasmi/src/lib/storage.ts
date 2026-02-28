import { ref, get, set, push, remove } from "firebase/database";
import { db } from "./firebase";
import type { Shloka } from "../types";

const SHLOKAS_PATH = "shlokas";

export const getShlokas = async (): Promise<Shloka[]> => {
    try {
        const shlokasRef = ref(db, SHLOKAS_PATH);
        const snapshot = await get(shlokasRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            // Convert Firebase object to array and ensure ID is present
            return Object.entries(data).map(([id, value]) => ({
                ...(value as any),
                id
            })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }

        // Return empty if no data in Firebase
        return [];
    } catch (error) {
        console.error("Error fetching shlokas from Firebase:", error);
        return [];
    }
};

export const addShloka = async (shloka: Shloka): Promise<void> => {
    try {
        const shlokasRef = ref(db, SHLOKAS_PATH);
        const newShlokaRef = push(shlokasRef);
        // We use the push key as the id, or keep the existing id if provided
        const finalShloka = { ...shloka, id: newShlokaRef.key || shloka.id };
        await set(newShlokaRef, finalShloka);
    } catch (error) {
        console.error("Error adding shloka to Firebase:", error);
        throw error;
    }
};

export const deleteShloka = async (id: string): Promise<void> => {
    try {
        const shlokaRef = ref(db, `${SHLOKAS_PATH}/${id}`);
        await remove(shlokaRef);
    } catch (error) {
        console.error("Error deleting shloka from Firebase:", error);
        throw error;
    }
};
