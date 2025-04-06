import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";

// Pages
import Dashboard from "@/pages/Dashboard";
import QuranReader from "@/pages/QuranReader";
import Calendar from "@/pages/Calendar";
import Community from "@/pages/Community";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

// Components
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import OfflineIndicator from "@/components/OfflineIndicator";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import { useOffline } from "./hooks/use-offline";
import { usePwaInstall } from "./hooks/use-pwa-install";

function Router() {
  const [location] = useLocation();

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/quran" component={QuranReader} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/community" component={Community} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const isOffline = useOffline();
  const { shouldShowInstallPrompt, installApp, dismissPrompt } = usePwaInstall();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "enabled" || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches && 
        !localStorage.getItem("darkMode"));
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode ? "enabled" : "disabled");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen relative">
        {isOffline && <OfflineIndicator />}
        
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="flex-grow relative">
          <div className="islamic-pattern absolute inset-0 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
            <Router />
          </div>
        </main>
        
        <BottomNav />
        
        {shouldShowInstallPrompt && (
          <PwaInstallPrompt onInstall={installApp} onDismiss={dismissPrompt} />
        )}
        
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
