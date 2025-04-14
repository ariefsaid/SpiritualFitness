'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QuranReading, InsertQuranReading } from '@shared/schema';
import { differenceInDays } from 'date-fns';

// This will be replaced by a proper API client function
const apiRequest = async <T,>(method: string, url: string, data?: any): Promise<T> => {
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

export function useQuran() {
  const queryClient = useQueryClient();
  
  const { data: readings = [], isLoading: readingsLoading } = useQuery<QuranReading[]>({
    queryKey: ['/api/quran/readings'],
    queryFn: async () => {
      return apiRequest<QuranReading[]>('GET', '/api/quran/readings');
    }
  });

  const { data: latestReading, isLoading: latestLoading } = useQuery<QuranReading>({
    queryKey: ['/api/quran/readings/latest'],
    queryFn: async () => {
      return apiRequest<QuranReading>('GET', '/api/quran/readings/latest');
    }
  });

  const createReadingMutation = useMutation({
    mutationFn: async (reading: InsertQuranReading) => {
      return apiRequest<QuranReading>('POST', '/api/quran/readings', reading);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quran/readings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quran/readings/latest'] });
    },
  });

  const updateReadingMutation = useMutation({
    mutationFn: async ({ id, reading }: { id: number; reading: Partial<QuranReading> }) => {
      return apiRequest<QuranReading>('PATCH', `/api/quran/readings/${id}`, reading);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quran/readings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quran/readings/latest'] });
    },
  });

  // Calculate streak
  const calculateStreak = () => {
    if (!readings.length) return 0;

    // Sort readings by date, most recent first
    const sortedReadings = [...readings].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    
    // Check if there's a reading for today
    const hasTodayReading = sortedReadings.some(
      reading => differenceInDays(currentDate, new Date(reading.date)) === 0
    );
    
    if (!hasTodayReading) {
      // If no reading today, start checking from yesterday
      currentDate.setDate(currentDate.getDate() - 1);
    }

    for (let i = 0; i < sortedReadings.length; i++) {
      const readingDate = new Date(sortedReadings[i].date);
      const dayDiff = differenceInDays(currentDate, readingDate);

      if (dayDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();
  const currentReading = latestReading;
  const isLoading = readingsLoading || latestLoading;

  const createReading = async (reading: InsertQuranReading) => {
    return createReadingMutation.mutateAsync(reading);
  };

  const updateReading = async (id: number, reading: Partial<QuranReading>) => {
    return updateReadingMutation.mutateAsync({ id, reading });
  };

  return {
    readings,
    currentReading,
    streak,
    isLoading,
    createReading,
    updateReading
  };
}