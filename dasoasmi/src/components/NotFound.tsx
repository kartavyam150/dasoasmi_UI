import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="text-8xl mb-6 select-none">🙏</div>

      <h1 className="text-7xl sm:text-9xl font-serif text-primary drop-shadow-sm mb-3 select-none">
        दासोऽस्मि
      </h1>
      <p className="text-sm font-serif font-medium text-foreground mb-1">
        गोपी-भर्तुः पद-कमलयोर् दास-दासानुदासः
      </p>
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">
        gopī-bhartuḥ pada-kamalayor dāsa-dāsānudāsaḥ
      </p>

      <p className="text-lg text-muted-foreground mb-2">
        The page you are looking for does not exist.
      </p>

      <p className="text-sm text-muted-foreground/70 mb-10">
        If you think something is missing, feel free to reach out.
      </p>

      <a
        href="https://instagram.com/_dasoasmi_"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 transition-colors font-serif font-medium text-base mb-8"
      >
        Contact us on Instagram — @_dasoasmi_
      </a>

      <Button variant="ghost" onClick={() => navigate('/')} className="mt-2">
        ← Back to Shlokas
      </Button>

    </div>
  );
}
