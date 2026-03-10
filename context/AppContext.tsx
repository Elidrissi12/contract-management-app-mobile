import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemeMode = 'light' | 'dark' | 'system';
type Language = 'fr' | 'en';

type AppContextValue = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  
  colorScheme: 'light' | 'dark';
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedContractId: number | null;
  setSelectedContractId: (id: number | null) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [language, setLanguage] = useState<Language>('fr');
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);

  const colorScheme: 'light' | 'dark' = useMemo(() => {
    if (themeMode === 'light' || themeMode === 'dark') {
      return themeMode;
    }
    return (systemColorScheme ?? 'light') === 'dark' ? 'dark' : 'light';
  }, [systemColorScheme, themeMode]);

  const value = useMemo<AppContextValue>(
    () => ({
      themeMode,
      setThemeMode,
      colorScheme,
      language,
      setLanguage,
      selectedContractId,
      setSelectedContractId,
    }),
    [themeMode, colorScheme, language, selectedContractId],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
}

