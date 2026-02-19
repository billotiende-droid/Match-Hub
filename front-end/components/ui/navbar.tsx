import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 dark:bg-black dark:border-gray-800">
     
      <Link href="/" className="flex items-center gap-3">
        
        <div className="w-10 h-10 relative">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            
            <circle cx="32" cy="32" r="30" className="fill-[#1a1a1a] dark:fill-white" />
          
            
            <path
              d="M32 2C32 2 45 10 50 20C55 30 52 45 52 45"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="stroke-white dark:stroke-black"
            />
            <path
              d="M32 2C32 2 19 10 14 20C9 30 12 45 12 45"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="stroke-white dark:stroke-black"
            />
            <path
              d="M2 32C2 32 10 19 20 14C30 9 45 12 45 12"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="stroke-white dark:stroke-black"
            />
            <path
              d="M62 32C62 32 54 19 44 14C34 9 19 12 19 12"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="stroke-white dark:stroke-black"
            />
            
            
            <path
              d="M32 22L38 30L35 39L29 39L26 30L32 22Z"
              className="fill-white dark:fill-black"
            />
          </svg>
        </div>
       
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          Match Hub
        </span>
      </Link>

      
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          Turfs
        </Link>
        <Link
          href="/matches"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          Games
        </Link>
        <Link
          href="/leagues"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          Tournament
        </Link>
      </div>
   
  );
}
