'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

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

const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: 'Prayer Warrior',
    description: 'Complete all 5 daily prayers for 7 consecutive days',
    icon: 'prayer',
    category: 'prayer',
    status: 'completed',
    progress: 100,
    unlockedAt: '2023-09-15T08:30:00Z'
  },
  {
    id: 2,
    title: 'Quran Beginner',
    description: 'Read Quran for 10 days',
    icon: 'quran',
    category: 'quran',
    status: 'in-progress',
    progress: 70,
    unlockedAt: null
  },
  {
    id: 3,
    title: 'Fasting Champion',
    description: 'Complete a full month of fasting',
    icon: 'fasting',
    category: 'fasting',
    status: 'in-progress',
    progress: 50,
    unlockedAt: null
  },
  {
    id: 4,
    title: 'Community Leader',
    description: 'Create a study group and invite 5 members',
    icon: 'community',
    category: 'community',
    status: 'locked',
    progress: 0,
    unlockedAt: null
  }
];

export default function Achievements() {
  const [filteredCategory, setFilteredCategory] = useState('all');
  
  // In a real implementation, this would fetch from an API
  const { data: achievements = mockAchievements, isLoading } = useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      // Simulate API call
      return new Promise<Achievement[]>((resolve) => {
        setTimeout(() => resolve(mockAchievements), 1000);
      });
    }
  });
  
  const filteredAchievements = filteredCategory === 'all' 
    ? achievements 
    : achievements.filter((a: Achievement) => a.category === filteredCategory);
  
  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case 'prayer':
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 17V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 13V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.5 10.5C15.5 10.5 14 11.5 12 11.5C10 11.5 8.5 10.5 8.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.5 7C15.5 7 14 8 12 8C10 8 8.5 7 8.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'quran':
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'fasting':
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5.5C10.8954 5.5 10 6.39543 10 7.5C10 8.60457 9.10457 9.5 8 9.5M12 5.5C13.1046 5.5 14 6.39543 14 7.5C14 8.60457 14.8954 9.5 16 9.5M12 5.5L12 14M12 14C10.8954 14 10 14.8954 10 16M12 14C13.1046 14 14 14.8954 14 16M8 19H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'community':
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M16.6438 16.1429C15.6229 14.5234 13.9187 13.4999 12 13.4999C10.0813 13.4999 8.37708 14.5234 7.35617 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35617 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35617 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.3055 5.5L9.67438 9H13.3277L13.9588 5.5H10.3055ZM14.2748 5.5L14.906 9H19L17.1111 5.5H14.2748ZM6.88889 5.5L5 9H9.15271L9.78382 5.5H6.88889ZM13.6667 10H9.33333L8 19H15L13.6667 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-4 animate-pulse">
              <div className="w-12 h-12 mx-auto bg-slate-200 dark:bg-slate-600 rounded-full mb-4"></div>
              <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded mb-2 w-3/4 mx-auto"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded mb-4 w-full"></div>
              <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-poppins font-semibold">Achievements</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilteredCategory('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              filteredCategory === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilteredCategory('prayer')}
            className={`px-3 py-1 text-sm rounded-full ${
              filteredCategory === 'prayer' 
                ? 'bg-primary text-white' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Prayer
          </button>
          <button 
            onClick={() => setFilteredCategory('quran')}
            className={`px-3 py-1 text-sm rounded-full ${
              filteredCategory === 'quran' 
                ? 'bg-primary text-white' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Quran
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAchievements.map(achievement => (
          <div key={achievement.id} className="text-center bg-slate-50 dark:bg-slate-800/80 rounded-lg p-6 border border-slate-100 dark:border-slate-700">
            <div className={`${
              achievement.status === 'completed' 
                ? 'achievement-icon-completed text-primary' 
                : achievement.status === 'in-progress' 
                  ? 'achievement-icon-progress text-accent' 
                  : 'achievement-icon-locked text-slate-400 dark:text-slate-500'
            } achievement-icon`}>
              {getAchievementIcon(achievement.icon)}
            </div>
            
            <h3 className="font-medium mb-2">{achievement.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{achievement.description}</p>
            
            {achievement.status === 'completed' && (
              <span className="achievement-badge-completed">Completed</span>
            )}
            
            {achievement.status === 'in-progress' && (
              <div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-accent rounded-full h-2" 
                    style={{ width: `${achievement.progress || 0}%` }}
                  ></div>
                </div>
                <span className="achievement-badge-progress">{achievement.progress || 0}% Complete</span>
              </div>
            )}
            
            {achievement.status === 'locked' && (
              <span className="achievement-badge-locked">Locked</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}