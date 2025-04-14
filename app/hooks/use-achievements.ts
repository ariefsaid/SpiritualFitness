'use client';

import { useState, useEffect } from 'react';

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

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchAchievements() {
      try {
        // Simulate API call with a fixed response for now
        // In production, this would fetch from an actual API endpoint
        setTimeout(() => {
          setAchievements([
            {
              id: 1,
              title: "Early Riser",
              description: "Complete Fajr prayer on time for 7 consecutive days",
              icon: "sunrise",
              category: "prayer",
              status: "completed",
              progress: 100,
              unlockedAt: "2025-01-15T07:00:00Z"
            },
            {
              id: 2,
              title: "Quran Companion",
              description: "Read Quran for at least 10 minutes daily for 5 days",
              icon: "book-open",
              category: "quran",
              status: "in-progress",
              progress: 60,
              unlockedAt: null
            },
            {
              id: 3,
              title: "Ramadan Warrior",
              description: "Complete all fasts during Ramadan",
              icon: "moon",
              category: "fasting",
              status: "locked",
              progress: null,
              unlockedAt: null
            },
            {
              id: 4,
              title: "Community Builder",
              description: "Join or create a community group",
              icon: "users",
              category: "community",
              status: "in-progress",
              progress: 50,
              unlockedAt: null
            },
            {
              id: 5,
              title: "Five Pillars",
              description: "Track all five daily prayers consistently for a month",
              icon: "check-circle",
              category: "prayer",
              status: "in-progress",
              progress: 80,
              unlockedAt: null
            }
          ]);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching achievements:', error);
        setIsLoading(false);
      }
    }
    
    fetchAchievements();
  }, []);
  
  return { achievements, isLoading };
}