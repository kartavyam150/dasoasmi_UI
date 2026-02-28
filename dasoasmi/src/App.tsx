import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { StrictMode } from 'react';
import './index.css';
import { SplashScreen } from './components/SplashScreen';
import { ShlokaCard } from './components/ShlokaCard';
import { AddShloka } from './components/AddShloka';
import { About } from './components/About';
import { Button } from './components/ui/Button';
import { Plus, BookOpen } from 'lucide-react';
import { getShlokas, addShloka } from './lib/storage';
import type { Shloka } from './types';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [shlokas, setShlokas] = useState<Shloka[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
      throw error; // Re-throw to allow AddShloka component to handle it
    }
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

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
                onClick={() => navigate('/about')}
                className={location.pathname === '/about' ? 'bg-primary/10 text-primary' : ''}
              >
                About
              </Button>
              {location.pathname === '/' && (
                <Button
                  onClick={() => navigate('/add')}
                  variant="default"
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Shloka
                </Button>
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
                  <Button onClick={() => navigate('/add')}>
                    Add Your First Shloka
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-10 max-w-4xl mx-auto">
                  {shlokas.map((shloka) => (
                    <ShlokaCard key={shloka.id} shloka={shloka} />
                  ))}
                </div>
              )
            } />
            <Route path="/add" element={
              <AddShloka onSave={handleAddShloka} onCancel={() => navigate('/')} />
            } />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
