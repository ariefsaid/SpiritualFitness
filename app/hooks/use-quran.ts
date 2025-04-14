'use client';

import { useState, useEffect } from 'react';

interface QuranReading {
  id: number;
  userId: number;
  date: string;
  surah: number;
  ayah: number;
  completions: number;
  progress: number;
  timeSpent: number | null;
  bookmark: boolean;
}

interface InsertQuranReading {
  userId: number;
  date: string;
  surah: number;
  ayah: number;
  timeSpent?: number;
  bookmark?: boolean;
}

export function useQuran() {
  const [readings, setReadings] = useState<QuranReading[]>([]);
  const [currentReading, setCurrentReading] = useState<QuranReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    async function fetchQuranReadings() {
      try {
        // Simulate API call with a fixed response for now
        setTimeout(() => {
          const mockReadings = [
            {
              id: 1,
              userId: 1,
              date: "2025-04-01",
              surah: 2,
              ayah: 45,
              completions: 3,
              progress: 0.15,
              timeSpent: 15,
              bookmark: true
            },
            {
              id: 2,
              userId: 1,
              date: "2025-04-02",
              surah: 1,
              ayah: 7,
              completions: 1,
              progress: 1.0,
              timeSpent: 5,
              bookmark: false
            },
            {
              id: 3,
              userId: 1,
              date: "2025-04-03",
              surah: 3,
              ayah: 23,
              completions: 2,
              progress: 0.1,
              timeSpent: 10,
              bookmark: false
            }
          ];
          
          setReadings(mockReadings);
          setCurrentReading(mockReadings[0]);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching Quran readings:', error);
        setIsLoading(false);
      }
    }
    
    fetchQuranReadings();
  }, []);
  
  const createReading = async (reading: InsertQuranReading) => {
    setIsSaving(true);
    try {
      // Simulate API call with a fixed response
      setTimeout(() => {
        const newReading: QuranReading = {
          ...reading,
          id: readings.length + 1,
          completions: 1,
          progress: 0.01,
          bookmark: reading.bookmark || false,
          timeSpent: reading.timeSpent || null
        };
        
        setReadings(prev => [newReading, ...prev]);
        setCurrentReading(newReading);
        setIsSaving(false);
      }, 500);
    } catch (error) {
      console.error('Error creating Quran reading:', error);
      setIsSaving(false);
    }
  };
  
  const updateReading = async (id: number, data: Partial<QuranReading>) => {
    setIsSaving(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setReadings(prev => 
          prev.map(reading => 
            reading.id === id ? { ...reading, ...data } : reading
          )
        );
        
        if (currentReading?.id === id) {
          setCurrentReading(prev => prev ? { ...prev, ...data } : prev);
        }
        
        setIsSaving(false);
      }, 500);
    } catch (error) {
      console.error('Error updating Quran reading:', error);
      setIsSaving(false);
    }
  };
  
  const deleteReading = async (id: number) => {
    setIsSaving(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setReadings(prev => prev.filter(r => r.id !== id));
        
        if (currentReading?.id === id) {
          setCurrentReading(readings.length > 1 ? readings[1] : null);
        }
        
        setIsSaving(false);
      }, 500);
    } catch (error) {
      console.error('Error deleting Quran reading:', error);
      setIsSaving(false);
    }
  };
  
  const toggleBookmark = async (id: number) => {
    const reading = readings.find(r => r.id === id);
    if (reading) {
      await updateReading(id, { bookmark: !reading.bookmark });
    }
  };
  
  return {
    readings,
    currentReading,
    isLoading,
    isSaving,
    createReading,
    updateReading,
    deleteReading,
    toggleBookmark
  };
}