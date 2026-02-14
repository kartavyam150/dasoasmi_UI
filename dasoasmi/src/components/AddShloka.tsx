import { useState } from "react";
import { Button } from "./ui/Button";
import { Input, Textarea } from "./ui/Input";
import type { Shloka } from "../types";
import { ArrowLeft } from "lucide-react";

interface AddShlokaProps {
    onSave: (shloka: Shloka) => void;
    onCancel: () => void;
}

export function AddShloka({ onSave, onCancel }: AddShlokaProps) {
    const [formData, setFormData] = useState<Partial<Shloka>>({
        text: "",
        translation: "",
        source: "",
        author: "",
        comment: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.text || !formData.translation) return;

        const newShloka: Shloka = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            text: formData.text!,
            translation: formData.translation!,
            source: formData.source || "Unknown",
            author: formData.author || "Unknown",
            comment: formData.comment || undefined,
        };

        onSave(newShloka);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-background/60 backdrop-blur-xl p-8 shadow-2xl dark:bg-zinc-900/60 animate-in fade-in zoom-in-95 duration-300">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-primary font-serif">Add New Shloka</h2>
                    <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Shloka Text</label>
                        <Textarea
                            required
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            placeholder="Enter the Sanskrit text..."
                            className="font-serif text-lg bg-white/40 dark:bg-black/20 focus:bg-white/60"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Translation</label>
                        <Textarea
                            required
                            value={formData.translation}
                            onChange={(e) =>
                                setFormData({ ...formData, translation: e.target.value })
                            }
                            placeholder="Enter the meaning..."
                            className="bg-white/40 dark:bg-black/20 focus:bg-white/60"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Source</label>
                            <Input
                                value={formData.source}
                                onChange={(e) =>
                                    setFormData({ ...formData, source: e.target.value })
                                }
                                placeholder="e.g. Bhagavad Gita"
                                className="bg-white/40 dark:bg-black/20 focus:bg-white/60"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Author/Speaker</label>
                            <Input
                                value={formData.author}
                                onChange={(e) =>
                                    setFormData({ ...formData, author: e.target.value })
                                }
                                placeholder="e.g. Lord Krishna"
                                className="bg-white/40 dark:bg-black/20 focus:bg-white/60"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Personal Note (Optional)</label>
                        <Input
                            value={formData.comment}
                            onChange={(e) =>
                                setFormData({ ...formData, comment: e.target.value })
                            }
                            placeholder="Thoughts or context..."
                            className="bg-white/40 dark:bg-black/20 focus:bg-white/60"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="default">
                            Add Shloka
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
