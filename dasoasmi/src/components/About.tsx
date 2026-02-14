import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { ArrowLeft } from "lucide-react";

export function About() {
    const navigate = useNavigate();

    return (
        <div className="relative z-10 mx-auto max-w-2xl px-4 pb-12 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mb-8 pl-0 hover:bg-transparent hover:text-primary gap-2"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Shlokas
            </Button>

            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-8 shadow-xl dark:bg-black/10 dark:border-white/10">
                <h1 className="mb-6 text-3xl font-bold font-serif text-primary text-center">About Dasoasmi</h1>

                <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <p>
                        <span className="font-semibold text-foreground">Dasoasmi</span> ("I am a servant") is a digital sanctuary for preserving and reflecting upon sacred wisdom.
                    </p>

                    <p>
                        In the hurry of modern life, the profound teachings of our scriptures often remain tucked away in books.
                        This application is designed to help you curate your own personal collection of Shlokas—verses that inspire, guide, and enlighten you.
                    </p>

                    <div className="rounded-lg bg-primary/5 p-6 border border-primary/10 my-8">
                        <h3 className="text-lg font-serif font-medium text-primary mb-2 text-center">Our Mission</h3>
                        <p className="italic text-center text-sm">
                            To weave ancient wisdom into the fabric of daily life, making the timeless accessible, personal, and ever-present.
                        </p>
                    </div>

                    <p>
                        The name is inspired by the Vaishnava sentiment of humble service: <br />
                        <span className="italic block mt-2 text-center font-serif text-foreground">
                            "Gopi-bhartur pada-kamalayor dasa-dasanudasah"
                        </span>
                        <span className="block text-center text-xs mt-1 opacity-70">
                            (Servant of the servant of the servant of the Lord)
                        </span>
                    </p>
                </div>

                <div className="mt-8 flex justify-center">
                    <a
                        href="https://instagram.com/_dasoasmi_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-serif font-medium"
                    >
                        Connect on Instagram
                    </a>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-center gap-6 text-xs xs:text-base text-black/80  tracking-widest relative z-10  pt-6 w-full">
                    <span>हरेर नामैव केवलम्</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-black/50" />
                    <span>नाम से धाम तक</span>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-muted-foreground/60">
                    <p>Version 1.0.0 • Built with devotion</p>
                </div>
            </div>
        </div>
    );
}
