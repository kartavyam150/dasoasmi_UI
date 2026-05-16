import { useState, useEffect } from 'react';
import { Lock, X } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAdmin } from '../context/AdminContext';

export function PinModal() {
  const { showPinModal, closePinModal, unlock, failedAttempts, recordFailedAttempt } = useAdmin();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (failedAttempts >= 2) {
      closePinModal();
      setPin('');
      setError(false);
    }
  }, [failedAttempts, closePinModal]);

  if (!showPinModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === import.meta.env.VITE_ADMIN_PIN) {
      unlock();
      setPin('');
      setError(false);
    } else {
      recordFailedAttempt();
      setError(true);
      setPin('');
    }
  };

  const handleClose = () => {
    closePinModal();
    setPin('');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl border border-border bg-background/95 backdrop-blur-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold font-serif">Admin Access</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter your PIN to enable edit & delete.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
            autoFocus
          />
          {error && (
            <p className="text-destructive text-sm -mt-2 text-center">
              {failedAttempts >= 2 ? 'Too many incorrect attempts.' : 'Incorrect PIN. Try again.'}
            </p>
          )}
          <Button type="submit" className="w-full">Unlock</Button>
        </form>
      </div>
    </div>
  );
}
