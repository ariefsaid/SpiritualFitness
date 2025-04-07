import { useState } from "react";
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
  
  // Define quick actions based on current page
  const getActions = (): ActionItem[] => {
    switch (location) {
      case '/':
        return [
          {
            id: 'track-prayer',
            label: 'Track Prayer',
            icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V9L12 14L22 9V7L12 2Z" fill="currentColor" />
                <path d="M5 10.5V15.5L12 19.5L19 15.5V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 14V19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
            action: () => {
              // This would open a prayer tracking dialog
              console.log('Track prayer');
              setIsOpen(false);
            }
          },
          {
            id: 'track-fasting',
            label: 'Track Fasting',
            icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5.5C10.8954 5.5 10 6.39543 10 7.5C10 8.60457 9.10457 9.5 8 9.5M12 5.5C13.1046 5.5 14 6.39543 14 7.5C14 8.60457 14.8954 9.5 16 9.5M12 5.5L12 14M12 14C10.8954 14 10 14.8954 10 16M12 14C13.1046 14 14 14.8954 14 16M8 19H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
            action: () => {
              // This would open a fasting tracking dialog
              console.log('Track fasting');
              setIsOpen(false);
            }
          },
          {
            id: 'track-quran',
            label: 'Read Quran',
            icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
            action: () => {
              // Navigate to Quran page
              window.location.href = '/quran';
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
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
            label: 'Track Prayer',
            icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V9L12 14L22 9V7L12 2Z" fill="currentColor" />
                <path d="M5 10.5V15.5L12 19.5L19 15.5V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 14V19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
    <div className="fixed right-4 bottom-20 z-50 flex flex-col-reverse items-end space-y-reverse space-y-2 md:hidden">
      {isOpen && (
        <div className="flex flex-col-reverse space-y-2 space-y-reverse">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="fab-action-button touch-ripple"
              aria-label={action.label}
            >
              <span className="fab-action-label">{action.label}</span>
              <div className="fab-action-icon">
                {action.icon}
              </div>
            </button>
          ))}
        </div>
      )}
      
      <button 
        className={`fab-main touch-ripple ${isOpen ? 'fab-main-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close actions" : "Open actions"}
      >
        <svg 
          className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
