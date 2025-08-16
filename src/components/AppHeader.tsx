import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface AppHeaderProps {
  title: string
  subtitle?: string
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const location = useLocation()
  
  const isCurrentPath = (path: string) => location.pathname === path

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Page Title */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-lg">ب</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground tracking-tight">Barakah Life</h1>
              </div>
            </Link>
            
            {/* Page Title - Only show on mobile when different from logo */}
            {title !== "Dashboard" && (
              <div className="sm:hidden">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              </div>
            )}
          </div>

          {/* Right: Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-1 gap-1">
              <Link 
                to="/dashboard" 
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isCurrentPath('/dashboard') 
                    ? "bg-white dark:bg-gray-700 text-emerald-600 shadow-sm" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
                )}
              >
                Dashboard
              </Link>
              <Link 
                to="/tasks" 
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isCurrentPath('/tasks') 
                    ? "bg-white dark:bg-gray-700 text-emerald-600 shadow-sm" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
                )}
              >
                Tasks
              </Link>
              <Link 
                to="/calendar" 
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isCurrentPath('/calendar') 
                    ? "bg-white dark:bg-gray-700 text-emerald-600 shadow-sm" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
                )}
              >
                Calendar
              </Link>
              <Link 
                to="/prayers" 
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isCurrentPath('/prayers') 
                    ? "bg-white dark:bg-gray-700 text-emerald-600 shadow-sm" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
                )}
              >
                Prayers
              </Link>
              <Link 
                to="/quran" 
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isCurrentPath('/quran') 
                    ? "bg-white dark:bg-gray-700 text-emerald-600 shadow-sm" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
                )}
              >
                Qur'an
              </Link>
              <Link 
                to="/settings" 
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isCurrentPath('/settings') 
                    ? "bg-white dark:bg-gray-700 text-emerald-600 shadow-sm" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
                )}
              >
                Settings
              </Link>
            </div>
          </nav>
        </div>
        
        {/* Subtitle - Clean, subtle */}
        {subtitle && (
          <div className="mt-2 hidden sm:block">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{subtitle}</p>
          </div>
        )}
      </div>
    </header>
  )
}