import { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { usePrayerTimes } from '@/hooks/use-prayer-times';
import { useFasting } from '@/hooks/use-fasting';
import { useQuran } from '@/hooks/use-quran';
import DashboardTabs from '@/components/DashboardTabs';
import { format, isSameDay } from 'date-fns';

export default function Calendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'prayers' | 'fasting' | 'quran'>('prayers');
  
  const { prayers, isLoading: prayersLoading } = usePrayerTimes(date);
  const { fastings, isLoading: fastingLoading } = useFasting();
  const { readings, isLoading: quranLoading } = useQuran();

  // Helper to check if date has prayer data
  const hasPrayerData = (day: Date) => {
    return prayers.some(prayer => isSameDay(new Date(prayer.date), day));
  };

  // Helper to check if date has fasting data
  const hasFastingData = (day: Date) => {
    return fastings.some(fasting => isSameDay(new Date(fasting.date), day));
  };

  // Helper to check if date has Quran reading data
  const hasQuranData = (day: Date) => {
    return readings.some(reading => isSameDay(new Date(reading.date), day));
  };

  const isLoading = prayersLoading || fastingLoading || quranLoading;

  return (
    <>
      <DashboardTabs />
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-poppins font-semibold">Calendar</h2>
          <div className="flex space-x-2 bg-white dark:bg-slate-800 rounded-md overflow-hidden shadow-sm">
            <button 
              className={`px-4 py-2 text-sm font-medium ${view === 'prayers' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setView('prayers')}
            >
              Prayers
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${view === 'fasting' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setView('fasting')}
            >
              Fasting
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${view === 'quran' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300'}`}
              onClick={() => setView('quran')}
            >
              Quran
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(day) => day && setDate(day)}
              className="rounded-md"
              modifiers={{
                highlighted: view === 'prayers' 
                  ? (day) => hasPrayerData(day) 
                  : view === 'fasting' 
                    ? (day) => hasFastingData(day)
                    : (day) => hasQuranData(day)
              }}
              modifiersStyles={{
                highlighted: { 
                  backgroundColor: 'rgba(var(--primary), 0.1)', 
                  color: 'rgb(var(--primary))',
                  fontWeight: 'bold'
                },
              }}
            />
          </div>
          
          <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium mb-4">{format(date, 'EEEE, MMMM do, yyyy')}</h3>
            
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center py-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded mr-4"></div>
                    <div className="flex-grow">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : view === 'prayers' ? (
              <div>
                {prayers.length > 0 ? (
                  <div className="space-y-4">
                    {prayers.map((prayer) => (
                      <div key={prayer.id} className="flex items-start py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                        <div className="w-16 text-slate-500 dark:text-slate-400 font-medium">
                          {prayer.name}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <div className={`h-4 w-4 rounded-full mr-2 ${prayer.isPrayed ? 'bg-green-500' : prayer.isQadha ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                            <span className="font-medium">
                              {prayer.isPrayed 
                                ? 'Prayed' 
                                : prayer.isQadha 
                                  ? 'Missed' 
                                  : 'Scheduled'}
                            </span>
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {prayer.isPrayed 
                              ? `Prayed ${prayer.isJamaah ? 'in jamaah' : 'individually'} at ${format(new Date(prayer.prayedAt || prayer.time), 'h:mm a')}`
                              : `Scheduled for ${format(new Date(prayer.time), 'h:mm a')}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p>No prayer data for this day.</p>
                    <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm">
                      Add Prayer Records
                    </button>
                  </div>
                )}
              </div>
            ) : view === 'fasting' ? (
              <div>
                {fastings.some(fasting => isSameDay(new Date(fasting.date), date)) ? (
                  <div>
                    {fastings
                      .filter(fasting => isSameDay(new Date(fasting.date), date))
                      .map((fasting) => (
                        <div key={fasting.id} className="bg-white dark:bg-slate-800 rounded-lg mb-4">
                          <div className="flex items-center mb-4">
                            <div className={`h-12 w-12 rounded-lg flex items-center justify-center mr-4 ${fasting.completed ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5.5C10.8954 5.5 10 6.39543 10 7.5C10 8.60457 9.10457 9.5 8 9.5M12 5.5C13.1046 5.5 14 6.39543 14 7.5C14 8.60457 14.8954 9.5 16 9.5M12 5.5L12 14M12 14C10.8954 14 10 14.8954 10 16M12 14C13.1046 14 14 14.8954 14 16M8 19H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">{fasting.type} Fast</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {fasting.completed ? 'Completed' : 'In progress'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-slate-500 dark:text-slate-400">Started at</span>
                              <span>{fasting.startTime ? format(new Date(fasting.startTime), 'h:mm a') : 'N/A'}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-slate-500 dark:text-slate-400">Ended at</span>
                              <span>{fasting.endTime ? format(new Date(fasting.endTime), 'h:mm a') : 'N/A'}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-slate-500 dark:text-slate-400">Duration</span>
                              <span>
                                {fasting.startTime && fasting.endTime 
                                  ? `${Math.round((new Date(fasting.endTime).getTime() - new Date(fasting.startTime).getTime()) / 3600000)} hours`
                                  : 'N/A'}
                              </span>
                            </div>
                            
                            {fasting.notes && (
                              <div>
                                <h5 className="text-sm font-medium mb-2">Notes</h5>
                                <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
                                  {fasting.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p>No fasting data for this day.</p>
                    <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm">
                      Add Fasting Record
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {readings.some(reading => isSameDay(new Date(reading.date), date)) ? (
                  <div>
                    {readings
                      .filter(reading => isSameDay(new Date(reading.date), date))
                      .map((reading) => (
                        <div key={reading.id} className="bg-white dark:bg-slate-800 rounded-lg mb-4">
                          <div className="flex items-center mb-4">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-4">
                              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">Quran Reading</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {reading.duration} minutes
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-slate-500 dark:text-slate-400">Surah</span>
                              <span>{reading.surahName}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-slate-500 dark:text-slate-400">Verses</span>
                              <span>
                                {reading.startVerse} - {reading.endVerse}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-slate-500 dark:text-slate-400">Session type</span>
                              <span className="capitalize">{reading.type.toLowerCase()}</span>
                            </div>
                            
                            {reading.notes && (
                              <div>
                                <h5 className="text-sm font-medium mb-2">Notes</h5>
                                <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
                                  {reading.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p>No Quran reading data for this day.</p>
                    <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm">
                      Add Reading Record
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}