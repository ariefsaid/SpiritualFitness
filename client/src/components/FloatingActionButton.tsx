import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";

type ActionItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
};

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const fabRef = useRef<HTMLDivElement>(null);
  
  // Handle clicks outside to close the FAB
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);
  
  // Toggle the FAB state
  const toggleFAB = () => {
    setIsOpen(!isOpen);
  };
  
  // Define quick actions based on current page
  const getActions = (): ActionItem[] => {
    switch (location) {
      case '/':
        return [
          {
            id: 'track-prayer',
            label: 'Prayer',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            ),
            action: () => {
              console.log('Track prayer');
              setIsOpen(false);
            }
          },
          {
            id: 'track-quran',
            label: 'Quran',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            ),
            action: () => {
              window.location.href = '/quran';
              setIsOpen(false);
            }
          },
          {
            id: 'track-fasting',
            label: 'Fasting',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            ),
            action: () => {
              console.log('Track fasting');
              setIsOpen(false);
            }
          },
          {
            id: 'track-workout',
            label: 'Workout',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.6 18.6L12 12l-6.6 6.6"></path>
                <path d="M12 12L5.4 5.4"></path>
                <path d="M12 12l6.6-6.6"></path>
              </svg>
            ),
            action: () => {
              console.log('Track workout');
              setIsOpen(false);
            }
          }
        ];
      case '/quran':
        return [
          {
            id: 'bookmark',
            label: 'Bookmark',
            icon: (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z" />
              </svg>
            ),
            action: () => {
              console.log('Bookmark Quran');
              setIsOpen(false);
            }
          },
          {
            id: 'track-reading',
            label: 'Track Reading',
            icon: (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" />
              </svg>
            ),
            action: () => {
              console.log('Track Quran reading');
              setIsOpen(false);
            }
          }
        ];
      default:
        return [
          {
            id: 'track-prayer',
            label: 'Prayer',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            ),
            action: () => {
              console.log('Track prayer');
              setIsOpen(false);
            }
          }
        ];
    }
  };

  const actions = getActions();

  return (
    <div ref={fabRef} className="fab-container fixed right-4 bottom-20 z-50 md:hidden">
      <button 
        className={`fab-main touch-ripple ${isOpen ? 'fab-main-active' : ''}`}
        onClick={toggleFAB}
        aria-label={isOpen ? "Close actions" : "Open actions"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        )}
      </button>
      
      <div className={`fab-actions flex flex-col-reverse gap-2 mb-2 mt-2 ${isOpen ? 'fab-active' : 'hidden'}`}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="fab-action-button touch-ripple"
            aria-label={action.label}
            data-action={action.id}
          >
            <div className="fab-action-icon">
              {action.icon}
            </div>
            <span className="fab-action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
