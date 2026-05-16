import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export function PinGate({ children }: { children: React.ReactNode }) {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === import.meta.env.VITE_ADMIN_PIN) {
      setUnlocked(true);
    } else {
      setAttempts((a) => a + 1);
      setError(true);
      setPin('');
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <Lock className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold font-serif mb-2">Restricted Access</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-xs">
        Enter your PIN to access the shloka editor.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-xs">
        <Input
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(false); }}
          className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
          autoFocus
        />
        {error && (
          <p className="text-destructive text-sm -mt-2">
            {attempts >= 3 ? 'Too many incorrect attempts.' : 'Incorrect PIN. Try again.'}
          </p>
        )}
        <Button type="submit" className="w-full">Unlock</Button>
      </form>
    </div>
  );
}
