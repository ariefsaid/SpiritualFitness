'use client';

import { QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { queryClient } from "@/lib/queryClient";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { ThemeProvider } from '@/components/theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  const { shouldShowInstallPrompt, installApp, dismissPrompt } = usePwaInstall();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider
      defaultTheme="system"
      attribute="class"
      enableSystem
    >
      <QueryClientProvider client={queryClient}>
        {children}
        
        {shouldShowInstallPrompt && (
          <PwaInstallPrompt 
            onInstall={() => {
              console.log('Installing PWA...');
              installApp();
            }} 
            onDismiss={() => {
              console.log('Dismissed PWA install prompt');
              dismissPrompt();
            }} 
          />
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}