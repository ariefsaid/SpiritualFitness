import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [shouldShowInstallPrompt, setShouldShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show install prompt
      setShouldShowInstallPrompt(true);
    };

    console.log('Setting up PWA install prompt handler');
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('Received beforeinstallprompt event');
      handler(e);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;

    // Clear the deferredPrompt variable, since
    // prompt() can only be called once
    setDeferredPrompt(null);
    setShouldShowInstallPrompt(false);

    // Log outcome
    const outcome = choiceResult.outcome === 'accepted' ?
      'User accepted the install prompt' :
      'User dismissed the install prompt';
    console.log(outcome);
  };

  const dismissPrompt = () => {
    setShouldShowInstallPrompt(false);
  };

  return { shouldShowInstallPrompt, installApp, dismissPrompt };
}