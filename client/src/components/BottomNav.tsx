import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const [location] = useLocation();
  const [prevLocation, setPrevLocation] = useState(location);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (location !== prevLocation) {
      // Determine transition direction based on navigation order
      const navOrder = ['/', '/quran', '/calendar', '/community', '/profile'];
      const prevIndex = navOrder.indexOf(prevLocation);
      const currentIndex = navOrder.indexOf(location);
      
      if (prevIndex !== -1 && currentIndex !== -1) {
        setTransitionDirection(currentIndex > prevIndex ? 'right' : 'left');
      }
      
      setPrevLocation(location);
      
      // Reset transition direction after animation completes
      const timer = setTimeout(() => {
        setTransitionDirection(null);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [location, prevLocation]);

  const isActive = (path: string) => location === path;

  // Return true if the page has new notifications
  const hasNotification = (path: string) => {
    // For demo purposes - in a real app this would check if there are actual notifications
    return path === '/community';
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 shadow-lg border-t border-slate-200 dark:border-slate-700 py-2 lg:hidden">
      <div className="container max-w-md mx-auto">
        <div className="flex justify-around">
          <Link href="/">
            <a className={`bottom-nav-button ${isActive('/') ? 'bottom-nav-button-active' : 'bottom-nav-button-inactive'} touch-ripple`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="text-xs mt-1">Home</span>
            </a>
          </Link>
          
          <Link href="/quran">
            <a className={`bottom-nav-button ${isActive('/quran') ? 'bottom-nav-button-active' : 'bottom-nav-button-inactive'} touch-ripple`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span className="text-xs mt-1">Quran</span>
            </a>
          </Link>
          
          <Link href="/calendar">
            <a className={`bottom-nav-button ${isActive('/calendar') ? 'bottom-nav-button-active' : 'bottom-nav-button-inactive'} touch-ripple`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span className="text-xs mt-1">Calendar</span>
            </a>
          </Link>
          
          <Link href="/community">
            <a className={`bottom-nav-button ${isActive('/community') ? 'bottom-nav-button-active' : 'bottom-nav-button-inactive'} touch-ripple relative`}>
              {hasNotification('/community') && !isActive('/community') && (
                <span className="notification-dot"></span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span className="text-xs mt-1">Community</span>
            </a>
          </Link>
          
          <Link href="/profile">
            <a className={`bottom-nav-button ${isActive('/profile') ? 'bottom-nav-button-active' : 'bottom-nav-button-inactive'} touch-ripple`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="text-xs mt-1">Profile</span>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
