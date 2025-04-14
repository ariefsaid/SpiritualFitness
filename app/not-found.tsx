import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors">
        Return Home
      </Link>
    </div>
  );
}