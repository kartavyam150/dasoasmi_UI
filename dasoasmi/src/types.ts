export interface Shloka {
    id: string;
    text: string;
    translation: string;
    source: string;
    author: string;
    date: string; // ISO string
    comment?: string;
}
