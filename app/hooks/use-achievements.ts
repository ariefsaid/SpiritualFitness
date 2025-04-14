'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Achievement } from '@shared/schema';

// This will be replaced by a proper API client function
const apiRequest = async <T>(method: string, url: string, data?: any): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

export function useAchievements() {
  const { data: achievements = [], isLoading, error } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
    queryFn: async () => {
      return apiRequest<Achievement[]>('GET', '/api/achievements');
    }
  });

  // Group achievements by type
  const prayerAchievements = achievements.filter(a => a.type.startsWith('prayer'));
  const quranAchievements = achievements.filter(a => a.type.startsWith('quran'));
  const fastingAchievements = achievements.filter(a => a.type.startsWith('fasting'));
  const communityAchievements = achievements.filter(a => a.type.startsWith('community'));

  return {
    achievements,
    prayerAchievements,
    quranAchievements,
    fastingAchievements,
    communityAchievements,
    isLoading,
    error
  };
}