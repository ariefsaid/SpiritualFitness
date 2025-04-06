import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useQuran } from '@/hooks/use-quran';
import { InsertQuranReading } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';
import DashboardTabs from '@/components/DashboardTabs';
import { useToast } from '@/hooks/use-toast';

export default function QuranReader() {
  const { toast } = useToast();
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [startVerse, setStartVerse] = useState(1);
  const [endVerse, setEndVerse] = useState(1);
  const [readingMode, setReadingMode] = useState<'read' | 'listen' | 'memorize'>('read');
  
  const { currentReading, streak, createReading } = useQuran();
  
  const { data: surahData, isLoading: isSurahLoading } = useQuery({
    queryKey: ['/api/quran/surah', selectedSurah],
    queryFn: async () => {
      return apiRequest('GET', `/api/quran/surah/${selectedSurah}`);
    }
  });

  const { data: allSurahs, isLoading: isAllSurahsLoading } = useQuery({
    queryKey: ['/api/quran/surahs'],
    queryFn: async () => {
      return apiRequest('GET', '/api/quran/surahs');
    }
  });

  // Set default end verse when surah changes
  useEffect(() => {
    if (surahData && surahData.verses) {
      setEndVerse(Math.min(endVerse, surahData.verses.length));
    }
  }, [surahData, endVerse]);

  // Handle reading session completion
  const handleCompleteReading = async () => {
    try {
      const duration = Math.floor(Math.random() * 30) + 10; // Simulate reading duration between 10-40 minutes
      
      const newReading: InsertQuranReading = {
        userId: 1, // This would normally come from auth context
        surahNumber: selectedSurah,
        startVerse,
        endVerse,
        date: new Date().toISOString(),
        duration,
        type: readingMode.toUpperCase(),
        completed: true,
        notes: ''
      };
      
      await createReading(newReading);
      
      toast({
        title: 'Reading recorded!',
        description: `You've completed reading from verse ${startVerse} to ${endVerse} of Surah ${surahData?.name}.`,
      });
      
      // Reset the verse selection
      setStartVerse(1);
      setEndVerse(surahData?.verses.length || 7);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record your reading session.',
        variant: 'destructive',
      });
    }
  };

  const isLoading = isSurahLoading || isAllSurahsLoading;
  
  return (
    <>
      <DashboardTabs />
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-poppins font-semibold">Quran Reader</h2>
          <div className="flex space-x-2 bg-white dark:bg-slate-800 rounded-md overflow-hidden shadow-sm">
            <button 
              className={`px-4 py-2 text-sm font-medium ${readingMode === 'read' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setReadingMode('read')}
            >
              Read
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${readingMode === 'listen' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setReadingMode('listen')}
            >
              Listen
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${readingMode === 'memorize' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setReadingMode('memorize')}
            >
              Memorize
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-poppins font-semibold text-lg mb-4">Surah List</h3>
            
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full mr-3"></div>
                    <div className="flex-grow">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                {allSurahs && allSurahs.map((surah: any) => (
                  <button
                    key={surah.number}
                    onClick={() => setSelectedSurah(surah.number)}
                    className={`w-full flex items-center py-2 px-3 rounded-md text-left transition-colors ${
                      selectedSurah === surah.number 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full mr-3 text-xs ${
                      selectedSurah === surah.number 
                        ? 'bg-white text-primary' 
                        : 'bg-primary/10 text-primary dark:bg-slate-600 dark:text-slate-300'
                    }`}>{surah.number}</span>
                    <div>
                      <div className="font-medium text-sm">{surah.name}</div>
                      <div className="text-xs opacity-80">{surah.englishName} • {surah.versesCount} verses</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <h4 className="font-medium text-sm mb-2">Your Progress</h4>
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 text-primary font-medium rounded-md py-2 px-3 text-center flex-1">
                  <div className="text-xl">{streak}</div>
                  <div className="text-xs">Day streak</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-md py-2 px-3 text-center flex-1">
                  <div className="text-xl">{currentReading ? (currentReading.surahNumber || 1) : 1}</div>
                  <div className="text-xs">Last surah</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="p-6 pb-0 flex-shrink-0">
              {surahData && (
                <div className="mb-4">
                  <h3 className="font-poppins font-semibold text-xl mb-1">
                    {surahData.number}. {surahData.name} ({surahData.englishName})
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {surahData.englishNameTranslation} • {surahData.revelationType} • {surahData.verses?.length || 0} Verses
                  </p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Verse</label>
                  <select 
                    value={startVerse}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setStartVerse(value);
                      if (value > endVerse) {
                        setEndVerse(value);
                      }
                    }}
                    className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md py-1.5 px-3 text-sm w-32"
                  >
                    {surahData && surahData.verses && 
                      [...Array(surahData.verses.length)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Verse {i + 1}</option>
                      ))
                    }
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">End Verse</label>
                  <select 
                    value={endVerse}
                    onChange={(e) => setEndVerse(parseInt(e.target.value))}
                    className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md py-1.5 px-3 text-sm w-32"
                  >
                    {surahData && surahData.verses && 
                      [...Array(surahData.verses.length)].map((_, i) => (
                        <option 
                          key={i + 1} 
                          value={i + 1}
                          disabled={i + 1 < startVerse}
                        >Verse {i + 1}</option>
                      ))
                    }
                  </select>
                </div>
                
                <div className="ml-auto">
                  <button 
                    onClick={handleCompleteReading}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md text-sm"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Complete Reading
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 pt-0 overflow-y-auto flex-grow">
              {isLoading ? (
                <div className="animate-pulse space-y-6">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="border-b border-slate-100 dark:border-slate-700 pb-6 last:border-0">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-full mb-4"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {surahData && surahData.verses && (
                    <div className="space-y-6">
                      {surahData.bismillah && (
                        <div className="text-center mb-8">
                          <p className="text-2xl mb-2 font-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">
                            In the name of Allah, the Entirely Merciful, the Especially Merciful
                          </p>
                        </div>
                      )}
                      
                      {surahData.verses
                        .slice(startVerse - 1, endVerse)
                        .map((verse: any) => (
                          <div key={verse.numberInSurah} className="verse-container border-b border-slate-100 dark:border-slate-700 pb-6 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="verse-number bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                                {verse.numberInSurah}
                              </div>
                              
                              <div className="flex space-x-2">
                                <button className="text-slate-400 hover:text-primary transition-colors">
                                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 19L9 5M9 5L4 10M9 5L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M19 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button className="text-slate-400 hover:text-primary transition-colors">
                                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 5L16 19M16 19L21 14M16 19L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M5 19L5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button className="text-slate-400 hover:text-primary transition-colors">
                                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button className="text-slate-400 hover:text-primary transition-colors">
                                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 7.5V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7.5M3 7.5H21M3 7.5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7.5M8 3V7.5M16 3V7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M8 12H8.01M12 12H12.01M16 12H16.01M8 16H8.01M12 16H12.01M16 16H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            <div className="text-right mb-3 font-arabic text-2xl leading-loose">
                              {verse.text}
                            </div>
                            
                            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                              {verse.translation}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}