import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import splashBg from "../assets/splash_manuscript.png";

interface SplashScreenProps {
    onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFading(true);
            setTimeout(onComplete, 1000); // Wait for fade out
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#E6DCC3] transition-opacity duration-1000",
                fading ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
                style={{ backgroundImage: `url(${splashBg})` }}
            />

            {/* Overlay for warmth/texture blending if needed */}
            <div className="absolute inset-0 bg-[#5c4033] mix-blend-overlay opacity-10 z-0" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 text-center">

                <div className="relative mb-6 h-32 w-32 sm:h-40 sm:w-40 opacity-90 drop-shadow-sm flex items-center justify-center animate-in fade-in zoom-in duration-1000">
                    <span className="text-7xl sm:text-9xl text-[#4A3728] drop-shadow-sm filter">
                        दासोऽस्मि
                    </span>
                </div>

                <p className="text-xs sm:text-sm text-[#5D4037] font-serif font-medium leading-relaxed max-w-[90%] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-forwards">
                    गोपी-भर्तुः पद-कमलयोर् दास-दासानुदासः
                </p>
                <p className="mt-2 text-[10px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#8D6E63] font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-forwards">
                    gopī-bhartuḥ pada-kamalayor dāsa-dāsānudāsaḥ
                </p>
            </div>
        </div>
    );
}
