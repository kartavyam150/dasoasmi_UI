import type { Shloka } from "../types";
import { cn } from "../lib/utils";
import tornParchmentBg from "../assets/torn_parchment_full.png";

interface ShlokaCardProps {
    shloka: Shloka;
    className?: string;
}

export function ShlokaCard({ shloka, className }: ShlokaCardProps) {
    return (
        <div
            className={cn(
                "relative flex flex-col p-12 sm:p-16 transition-all hover:scale-[1.01]",
                // Removed default bg colors to let image show
                className
            )}
        >
            {/* Torn Parchment Background Image */}
            {/* Using mix-blend-multiply to make the white background of the image transparent against the page */}
            <img
                src={tornParchmentBg}
                alt=""
                className="absolute inset-0 h-full w-full object-fill bg-blend-multiply dark:opacity-80 drop-shadow-xl"
                style={{ mixBlendMode: 'multiply' }}
            />

            <blockquote className="mb-8 relative z-10 text-center">
                <p className="text-2xl sm:text-3xl font-medium leading-relaxed italic font-semibold  font-serif drop-shadow-sm whitespace-pre-line">
                    {shloka.shloka}
                </p>
            </blockquote>
            <p className="   font-sans leading-relaxed font-semibold opacity-90 text-center">@dasoasmi          </p>

            <div className="mb-8 space-y-3 relative z-10 text-center">
                <p className="text-lg sm:text-xl text-black font-sans leading-relaxed font-semibold opacity-90">
                    {shloka.meaning}
                </p>
            </div>

            {shloka.comment && (
                <div className="mb-6 relative z-10 mx-auto max-w-[85%]">
                    <div className="rounded-lg bg-black/5 p-4 text-base italic text-black backdrop-blur-[1px] border border-black/10 text-center">
                        {shloka.comment}
                    </div>
                </div>
            )}
            <div className="mt-auto flex flex-wrap items-center justify-center gap-6 text-sm sm:text-base font-bold text-black/80 uppercase tracking-widest relative z-10 border-t border-black/20 pt-6 w-full">
                <span>{shloka.source}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-black/50" />
                <span>{shloka.uvaca}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-black/50" />
                <span>{new Date(shloka.date).toLocaleDateString()}</span>
            </div>
        </div>
    );
}
