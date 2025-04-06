import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Prayer, InsertPrayer } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';

export function usePrayerTimes(date: Date) {
  const formattedDate = format(date, 'yyyy-MM-dd');

  const { data: prayers = [], isLoading, error } = useQuery<Prayer[]>({
    queryKey: ['/api/prayers/daily', formattedDate],
    queryFn: async () => {
      return apiRequest<Prayer[]>('GET', `/api/prayers/daily?date=${formattedDate}`);
    }
  });

  const createPrayerMutation = useMutation({
    mutationFn: async (prayer: InsertPrayer) => {
      return apiRequest<Prayer>('POST', '/api/prayers', prayer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prayers/daily'] });
    },
  });

  const updatePrayerMutation = useMutation({
    mutationFn: async ({ id, prayer }: { id: number; prayer: Partial<Prayer> }) => {
      return apiRequest<Prayer>('PATCH', `/api/prayers/${id}`, prayer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prayers/daily'] });
    },
  });

  const createPrayer = async (prayer: InsertPrayer) => {
    return createPrayerMutation.mutateAsync(prayer);
  };

  const updatePrayer = async (id: number, prayer: Partial<Prayer>) => {
    return updatePrayerMutation.mutateAsync({ id, prayer });
  };

  return {
    prayers,
    isLoading,
    error,
    createPrayer,
    updatePrayer
  };
}