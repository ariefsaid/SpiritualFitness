'use client';

import { useState } from 'react';
import { useAchievements } from '@/hooks/use-achievements';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  status: 'completed' | 'in-progress' | 'locked';
  progress: number | null;
  unlockedAt: string | null;
}

export default function Achievements() {
  const { achievements, isLoading } = useAchievements();
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);
  
  const categories = [
    { id: null, name: 'All' },
    { id: 'prayer', name: 'Prayer' },
    { id: 'quran', name: 'Quran' },
    { id: 'fasting', name: 'Fasting' },
    { id: 'community', name: 'Community' }
  ];
  
  const filteredAchievements = filteredCategory === null 
    ? achievements 
    : achievements.filter((a: Achievement) => a.category === filteredCategory);
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-poppins font-semibold mb-6">Achievements</h2>
      
      <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category.id || 'all'}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                filteredCategory === category.id 
                  ? 'bg-primary text-white' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
              onClick={() => setFilteredCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredAchievements.map((achievement: Achievement) => (
          <div 
            key={achievement.id} 
            className={`flex items-start p-4 rounded-lg border ${
              achievement.status === 'completed' 
                ? 'bg-primary/5 border-primary/20' 
                : achievement.status === 'in-progress'
                  ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-100 dark:border-slate-700'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-70'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
              achievement.status === 'completed' 
                ? 'bg-primary/10 text-primary' 
                : achievement.status === 'in-progress'
                  ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}>
              {renderIcon(achievement.icon)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium mb-1">{achievement.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    {achievement.description}
                  </p>
                </div>
                
                {achievement.status === 'completed' && (
                  <div className="bg-primary/10 text-primary rounded-lg px-2 py-1 text-xs font-medium">
                    Completed
                  </div>
                )}
                
                {achievement.status === 'in-progress' && (
                  <div className="bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg px-2 py-1 text-xs font-medium">
                    In Progress
                  </div>
                )}
                
                {achievement.status === 'locked' && (
                  <div className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg px-2 py-1 text-xs font-medium">
                    Locked
                  </div>
                )}
              </div>
              
              {achievement.status === 'in-progress' && achievement.progress !== null && (
                <div className="mt-2">
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {achievement.progress}% completed
                  </p>
                </div>
              )}
              
              {achievement.status === 'completed' && achievement.unlockedAt && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderIcon(icon: string) {
  switch (icon) {
    case 'sunrise':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3V5M5.31412 7.31412L3.8999 5.8999M18.6858 7.31412L20.1 5.8999M5 13H3M21 13H19M17.7 13C17.7 15.7614 15.7614 17.7 13 17.7C10.2386 17.7 8.3 15.7614 8.3 13M22 17H2M16 21H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'book-open':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'moon':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'users':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M16.6438 16.1429C15.6229 14.5234 13.9187 13.4999 12 13.4999C10.0813 13.4999 8.37708 14.5234 7.35617 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35617 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35617 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'check-circle':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.4 15C19.1277 15.8031 19.2229 16.6718 19.7133 17.4009C20.2038 18.1301 21.0155 18.5947 21.9 18.6916C21.9682 18.7034 22 18.7646 22 18.8334V20.1666C22 20.2354 21.9682 20.2966 21.9 20.3084C21.0155 20.4053 20.2038 20.8699 19.7133 21.5991C19.2229 22.3282 19.1277 23.1969 19.4 24C19.4206 24.0657 19.3966 24.1366 19.3433 24.1775L18.2567 24.9441C18.1934 24.9913 18.1083 24.9807 18.0567 24.9225C17.4932 24.2905 16.691 23.9116 15.85 23.8734C15.0089 23.8351 14.1858 24.1398 13.5733 24.7225C13.5201 24.7727 13.44 24.7727 13.3867 24.7225L12.6133 23.9441C12.56 23.8938 12.56 23.8062 12.6133 23.7559C13.1741 23.1954 13.4639 22.4311 13.4639 21.6334C13.4639 20.8356 13.1741 20.0713 12.6133 19.5109C12.56 19.4606 12.56 19.373 12.6133 19.3228L13.3867 18.5444C13.44 18.4941 13.5201 18.4941 13.5733 18.5444C14.1858 19.1271 15.0089 19.4318 15.85 19.3936C16.691 19.3553 17.4932 18.9764 18.0567 18.3444C18.1083 18.2862 18.1934 18.2756 18.2567 18.3228L19.3433 19.0894C19.3966 19.1303 19.4206 19.2012 19.4 19.2669C19.1409 20.0348 19.225 20.8699 19.6775 21.5828C20.13 22.2957 20.8807 22.7691 21.7 22.8916" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12C2 13.9778 2.58649 15.9112 3.6853 17.5557C4.78412 19.2002 6.3459 20.4819 8.17317 21.2388C10.0004 21.9957 12.0111 22.1937 13.9509 21.8079C15.8907 21.422 17.6725 20.4696 19.0711 19.0711C20.4696 17.6725 21.422 15.8907 21.8079 13.9509C22.1937 12.0111 21.9957 10.0004 21.2388 8.17317C20.4819 6.3459 19.2002 4.78412 17.5557 3.6853C15.9112 2.58649 13.9778 2 12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
  }
}