import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { QuranReading, InsertQuranReading } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';
import { differenceInDays } from 'date-fns';

export function useQuran() {
  const { data: readings = [], isLoading: readingsLoading } = useQuery<QuranReading[]>({
    queryKey: ['/api/quran/readings'],
    queryFn: async () => {
      return apiRequest('GET', '/api/quran/readings');
    }
  });

  const { data: latestReading, isLoading: latestLoading } = useQuery<QuranReading>({
    queryKey: ['/api/quran/readings/latest'],
    queryFn: async () => {
      return apiRequest('GET', '/api/quran/readings/latest');
    }
  });

  const createReadingMutation = useMutation({
    mutationFn: async (reading: InsertQuranReading) => {
      return apiRequest('POST', '/api/quran/readings', reading);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quran/readings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quran/readings/latest'] });
    },
  });

  const updateReadingMutation = useMutation({
    mutationFn: async ({ id, reading }: { id: number; reading: Partial<QuranReading> }) => {
      return apiRequest('PATCH', `/api/quran/readings/${id}`, reading);
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