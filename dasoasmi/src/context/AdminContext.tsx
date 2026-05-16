import { createContext, useContext, useState, type ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  showPinModal: boolean;
  failedAttempts: number;
  openPinModal: () => void;
  closePinModal: () => void;
  unlock: () => void;
  recordFailedAttempt: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  return (
    <AdminContext.Provider value={{
      isAdmin,
      showPinModal,
      failedAttempts,
      openPinModal: () => setShowPinModal(true),
      closePinModal: () => setShowPinModal(false),
      unlock: () => { setIsAdmin(true); setShowPinModal(false); },
      recordFailedAttempt: () => setFailedAttempts((a) => a + 1),
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
