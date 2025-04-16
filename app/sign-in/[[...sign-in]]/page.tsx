import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue your spiritual journey
          </p>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-emerald-600 hover:bg-emerald-700 text-sm normal-case",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                dividerLine: "bg-gray-300 dark:bg-gray-700",
                dividerText: "text-gray-500 dark:text-gray-400",
                socialButtonsBlockButton: 
                  "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300",
                formFieldLabel: "text-gray-700 dark:text-gray-300",
                formFieldInput: 
                  "block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:bg-gray-700 dark:text-white sm:text-sm",
              },
            }}
            routing="path"
            path="/sign-in"
            redirectUrl="/"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}