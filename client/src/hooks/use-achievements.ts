import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Achievement } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

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