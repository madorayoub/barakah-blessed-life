import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface AppHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
}

export function AppHeader({ title, subtitle, showBackButton = false }: AppHeaderProps) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  
  const isCurrentPath = (path: string) => location.pathname === path

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/dashboard" 
                className={cn(
                  "text-sm font-medium hover:text-foreground transition-colors",
                  isCurrentPath('/dashboard') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Dashboard
              </Link>
              <Link 
                to="/tasks" 
                className={cn(
                  "text-sm font-medium hover:text-foreground transition-colors",
                  isCurrentPath('/tasks') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Tasks
              </Link>
              <Link 
                to="/prayers" 
                className={cn(
                  "text-sm font-medium hover:text-foreground transition-colors",
                  isCurrentPath('/prayers') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Prayers
              </Link>
              <Link 
                to="/quran" 
                className={cn(
                  "text-sm font-medium hover:text-foreground transition-colors",
                  isCurrentPath('/quran') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Qur'an
              </Link>
              <Link 
                to="/calendar" 
                className={cn(
                  "text-sm font-medium hover:text-foreground transition-colors",
                  isCurrentPath('/calendar') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Calendar
              </Link>
              <Link 
                to="/analytics" 
                className={cn(
                  "text-sm font-medium hover:text-foreground transition-colors",
                  isCurrentPath('/analytics') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Analytics
              </Link>
              <Link 
                to="/settings" 
                className={cn(
                  "text-sm font-medium hover:text-foreground transition-colors",
                  isCurrentPath('/settings') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Settings
              </Link>
            </nav>
            <Button onClick={signOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}