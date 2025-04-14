import Link from 'next/link';

export const metadata = {
  title: 'You Are Offline - SpiritualFit',
  description: 'SpiritualFit is currently offline. Some features may be limited.'
};

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          You&apos;re Offline
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Don&apos;t worry! SpiritualFit works offline. You can still access your saved 
          data and continue your spiritual journey.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-medium text-lg mb-2">Available Offline</h3>
            <ul className="text-sm text-left text-gray-600 dark:text-gray-300 space-y-2">
              <li>• View saved prayers</li>
              <li>• Track fasting days</li>
              <li>• Access cached Quran readings</li>
              <li>• View achievements</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-medium text-lg mb-2">Needs Connection</h3>
            <ul className="text-sm text-left text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Syncing new data</li>
              <li>• Community features</li>
              <li>• Downloading new content</li>
              <li>• Account management</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 shadow-sm">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}