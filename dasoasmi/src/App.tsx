import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { StrictMode } from 'react';
import './index.css';
import { SplashScreen } from './components/SplashScreen';
import { ShlokaCard } from './components/ShlokaCard';
import { AddShloka } from './components/AddShloka';
import { About } from './components/About';
import { Stats } from './components/Stats';
import { NotFound } from './components/NotFound';
import { PinGate } from './components/PinGate';
import { PinModal } from './components/PinModal';
import { Button } from './components/ui/Button';
import { BookOpen, Lock, Search, X, BarChart2 } from 'lucide-react';
import { getShlokas, addShloka, updateShloka, deleteShloka } from './lib/storage';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { cn } from './lib/utils';
import type { Shloka } from './types';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [shlokas, setShlokas] = useState<Shloka[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, openPinModal, failedAttempts } = useAdmin();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchShlokas = async () => {
      setIsLoading(true);
      try {
        const data = await getShlokas();
        setShlokas(data);
      } catch (error) {
        console.error("Failed to fetch shlokas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShlokas();
  }, []);

  const handleAddShloka = async (newShloka: Shloka) => {
    // Check for duplicates
    const isDuplicate = shlokas.some(
      (s) => s.shloka.trim().toLowerCase() === newShloka.shloka.trim().toLowerCase()
    );

    if (isDuplicate) {
      console.log("Comparison result: Duplicate found!");
      console.log("Existing shlokas:", shlokas.map(s => s.shloka));
      console.log("New shloka text:", newShloka.shloka);
      alert("This shloka already exists in your collection!");
      return;
    }

    try {
      await addShloka(newShloka);
      const data = await getShlokas();
      setShlokas(data);
      navigate('/');
    } catch (error) {
      console.error("Failed to add shloka:", error);
      throw error;
    }
  };

  const handleEditShloka = async (updated: Shloka) => {
    await updateShloka(updated);
    setShlokas((prev) => prev.map((s) => s.id === updated.id ? updated : s));
  };

  const handleDeleteShloka = async (id: string) => {
    await deleteShloka(id);
    setShlokas((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredShlokas = query.trim()
    ? shlokas.filter((s) => {
        const q = query.toLowerCase();
        return (
          (s.shloka ?? '').toLowerCase().includes(q) ||
          (s.meaning ?? '').toLowerCase().includes(q) ||
          (s.source ?? '').toLowerCase().includes(q) ||
          (s.uvaca ?? '').toLowerCase().includes(q) ||
          (s.comment ?? '').toLowerCase().includes(q)
        );
      })
    : shlokas;

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <PinModal />

      <div className="min-h-screen bg-background text-foreground transition-all duration-1000">
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-serif tracking-wide text-primary">DASOASMI</span>
            </div>

            <nav className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/stats')}
                className={location.pathname === '/stats' ? 'bg-primary/10 text-primary' : ''}
              >
                <BarChart2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/about')}
                className={location.pathname === '/about' ? 'bg-primary/10 text-primary' : ''}
              >
                About
              </Button>
              {failedAttempts < 2 && (
                <button
                  onClick={openPinModal}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    isAdmin
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground/40 hover:text-muted-foreground"
                  )}
                  title="Admin"
                >
                  <Lock className="h-4 w-4" />
                </button>
              )}
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : shlokas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
                  <div className="rounded-full bg-primary/10 p-6 mb-4">
                    <BookOpen className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">No Shlokas Yet</h2>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    Start your collection of wisdom by adding your first shloka.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-10 max-w-4xl mx-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search shlokas, meaning, source…"
                      className="w-full rounded-xl border border-border bg-background/80 backdrop-blur-sm pl-9 pr-9 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {filteredShlokas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-300">
                      <Search className="h-8 w-8 text-muted-foreground/40 mb-3" />
                      <p className="text-muted-foreground">No shlokas found for "<span className="text-foreground">{query}</span>"</p>
                    </div>
                  ) : (
                    filteredShlokas.map((shloka) => (
                      <ShlokaCard
                        key={shloka.id}
                        shloka={shloka}
                        onEdit={handleEditShloka}
                        onDelete={handleDeleteShloka}
                      />
                    ))
                  )}
                </div>
              )
            } />
            <Route path="/dasoasmi-admin" element={
              <PinGate>
                <AddShloka onSave={handleAddShloka} onCancel={() => navigate('/')} />
              </PinGate>
            } />
            <Route path="/stats" element={<Stats shlokas={shlokas} />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
