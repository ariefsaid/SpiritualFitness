import React from 'react';
import DashboardTabs from '@/components/DashboardTabs';
import DailyQuote from '@/components/DailyQuote';
import QuranProgress from '@/components/QuranProgress';

/**
 * Dashboard (Home) Page
 */
export default function Home() {
  return (
    <div className="animate-fade-in">
      <DailyQuote />
      <QuranProgress />
      <DashboardTabs />
    </div>
  );
}