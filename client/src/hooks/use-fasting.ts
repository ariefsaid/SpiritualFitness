import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Fasting, InsertFasting } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';

export function useFasting() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const startDate = format(startOfMonth, 'yyyy-MM-dd');
  const endDate = format(endOfMonth, 'yyyy-MM-dd');

  const { data: fastings = [], isLoading, error } = useQuery<Fasting[]>({
    queryKey: ['/api/fastings', startDate, endDate],
    queryFn: async () => {
      return apiRequest<Fasting[]>('GET', `/api/fastings?startDate=${startDate}&endDate=${endDate}`);
    }
  });

  const createFastingMutation = useMutation({
    mutationFn: async (fasting: InsertFasting) => {
      return apiRequest<Fasting>('POST', '/api/fastings', fasting);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fastings'] });
    },
  });

  const updateFastingMutation = useMutation({
    mutationFn: async ({ id, fasting }: { id: number; fasting: Partial<Fasting> }) => {
      return apiRequest<Fasting>('PATCH', `/api/fastings/${id}`, fasting);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fastings'] });
    },
  });

  const createFasting = async (fasting: InsertFasting) => {
    return createFastingMutation.mutateAsync(fasting);
  };

  const updateFasting = async (id: number, fasting: Partial<Fasting>) => {
    return updateFastingMutation.mutateAsync({ id, fasting });
  };

  return {
    fastings,
    isLoading,
    error,
    createFasting,
    updateFasting
  };
}