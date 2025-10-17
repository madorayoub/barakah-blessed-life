import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { ThemeToggle } from '@/components/theme/theme-toggle'

interface AppHeaderProps {
  title: string
  subtitle?: string
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const location = useLocation()
  const { user } = useAuth()
  
  const isCurrentPath = (path: string) => location.pathname === path

  return (
    <header className="border-b border-border/60 bg-card/95 shadow-sm supports-[backdrop-filter]:backdrop-blur">
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

          {/* Right: Navigation + Theme */}
          <nav className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-muted/40 p-1">
              <Link
                to="/dashboard"
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isCurrentPath('/dashboard')
                    ? "bg-background text-emerald-600 shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                Dashboard
              </Link>
              <Link 
                to="/tasks"
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isCurrentPath('/tasks')
                    ? "bg-background text-emerald-600 shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                Tasks
              </Link>
              <Link 
                to="/calendar"
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isCurrentPath('/calendar')
                    ? "bg-background text-emerald-600 shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                Calendar
              </Link>
              <Link 
                to="/prayers"
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isCurrentPath('/prayers')
                    ? "bg-background text-emerald-600 shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                Prayers
              </Link>
              <Link 
                to="/quran"
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isCurrentPath('/quran')
                    ? "bg-background text-emerald-600 shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                Qur'an
              </Link>
              <Link 
                to="/settings"
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isCurrentPath('/settings')
                    ? "bg-background text-emerald-600 shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                Settings
              </Link>
              {/* Only show pricing for non-logged-in users */}
              {!user && (
                <Link
                  to="/pricing"
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    isCurrentPath('/pricing')
                      ? "bg-background text-emerald-600 shadow-sm"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  Pricing
                </Link>
              )}
            </div>
            <ThemeToggle />
          </nav>
        </div>
        
        {/* Subtitle - Clean, subtle */}
        {subtitle && (
          <div className="mt-2 hidden sm:block">
            <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
          </div>
        )}
      </div>
    </header>
  )
}
