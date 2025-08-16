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
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/dashboard" 
                className={cn(
                  "hover:text-foreground transition-colors",
                  isCurrentPath('/dashboard') ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                Dashboard
              </Link>
              <Link 
                to="/tasks" 
                className={cn(
                  "hover:text-foreground transition-colors",
                  isCurrentPath('/tasks') ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                Tasks
              </Link>
              <Link 
                to="/prayers" 
                className={cn(
                  "hover:text-foreground transition-colors",
                  isCurrentPath('/prayers') ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                Prayers
              </Link>
              <Link 
                to="/quran" 
                className={cn(
                  "hover:text-foreground transition-colors",
                  isCurrentPath('/quran') ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                Qur'an
              </Link>
              <Link 
                to="/calendar" 
                className={cn(
                  "hover:text-foreground transition-colors",
                  isCurrentPath('/calendar') ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                Calendar
              </Link>
              <Link 
                to="/analytics" 
                className={cn(
                  "hover:text-foreground transition-colors",
                  isCurrentPath('/analytics') ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                Analytics
              </Link>
              <Link 
                to="/settings" 
                className={cn(
                  "hover:text-foreground transition-colors",
                  isCurrentPath('/settings') ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                Settings
              </Link>
            </div>
            <Button onClick={signOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}