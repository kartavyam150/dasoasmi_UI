import type { Shloka } from "../types";

const STORAGE_KEY = "dasoasmi_shlokas";

export const getShlokas = (): Shloka[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }

    // Default sample data provided by user
    const defaultData: Shloka[] = [
        {
            id: "sample-1",
            text: "तस्माद्भारत सर्वात्मा भगवानिश्वरो हरिः ।\nश्रोतव्यः कीर्तितव्यश्च स्मर्तव्यश्चेच्छताभयम् ॥ 5 ॥",
            translation: "Therefore, O descendant of Bharata, he who desires fearlessness should hear about, glorify and remember the Personality of Godhead, the Supreme Controller, Hari.",
            comment: "शुकदेव गोस्वामी ने आगे कहा: हे राजा परीक्षित, तब भगवान ब्रह्मा ने पास में हाथ जोड़कर खड़े प्रह्लाद महाराज के समक्ष परमेश्वर से बात करना शुरू किया।",
            source: "ŚB 8.22.18",
            author: "श्रीशुक उवाच",
            date: "2025-12-16T00:00:00.000Z" // 16/12/2025
        }
    ];

    // Save default so it persists
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
};

export const addShloka = (shloka: Shloka): void => {
    const current = getShlokas();
    const updated = [shloka, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const deleteShloka = (id: string): void => {
    const current = getShlokas();
    const updated = current.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
