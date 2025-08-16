import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export type ThemeType = 'timeline' | 'agenda' | 'cards' | 'zen' | 'blocks'

interface Theme {
  id: ThemeType
  name: string
  icon: string
  description: string
  color: string
}

interface ThemeSelectorProps {
  currentTheme: ThemeType
  onThemeChange: (theme: ThemeType) => void
}

const themes: Theme[] = [
  { 
    id: 'timeline', 
    name: 'Timeline', 
    icon: '📅',
    description: 'Google Calendar style',
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  { 
    id: 'agenda', 
    name: 'Agenda', 
    icon: '📋',
    description: 'Clean list for focus',
    color: 'bg-green-50 border-green-200 text-green-700'
  },
  { 
    id: 'cards', 
    name: 'Cards', 
    icon: '🎴',
    description: 'Pinterest style',
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  },
  { 
    id: 'zen', 
    name: 'Zen', 
    icon: '🕊️',
    description: 'Minimal & peaceful',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700'
  },
  { 
    id: 'blocks', 
    name: 'Blocks', 
    icon: '⏰',
    description: 'Time boxing',
    color: 'bg-orange-50 border-orange-200 text-orange-700'
  }
]

// Smart theme suggestions based on time of day
export const getRecommendedTheme = (): ThemeType => {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour <= 9) return 'blocks' // Productivity morning
  if (hour >= 9 && hour <= 17) return 'timeline' // Work hours
  if (hour >= 18 && hour <= 22) return 'cards' // Evening inspiration
  return 'zen' // Late night/early morning calm
}

const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const recommendedTheme = getRecommendedTheme()

  return (
    <div className="theme-selector space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {themes.map(theme => (
          <Button
            key={theme.id}
            variant={currentTheme === theme.id ? "default" : "outline"}
            size="sm"
            onClick={() => onThemeChange(theme.id)}
            className={`
              relative transition-all duration-200
              ${currentTheme === theme.id 
                ? 'shadow-md' 
                : 'hover:scale-105 hover:shadow-sm'
              }
            `}
          >
            <span className="mr-2">{theme.icon}</span>
            {theme.name}
            
            {/* Recommended badge */}
            {theme.id === recommendedTheme && currentTheme !== theme.id && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 text-xs px-1 py-0 bg-amber-100 text-amber-700 border-amber-300"
              >
                ✨
              </Badge>
            )}
          </Button>
        ))}
      </div>
      
      {/* Theme description */}
      <div className="text-center">
        <Badge variant="outline" className={themes.find(t => t.id === currentTheme)?.color}>
          {themes.find(t => t.id === currentTheme)?.description}
        </Badge>
      </div>
      
      {/* Smart suggestion */}
      {currentTheme !== recommendedTheme && (
        <div className="text-center text-sm text-muted-foreground">
          💡 Tip: Try <button 
            onClick={() => onThemeChange(recommendedTheme)}
            className="text-amber-600 hover:text-amber-700 font-medium underline"
          >
            {themes.find(t => t.id === recommendedTheme)?.name}
          </button> for this time of day
        </div>
      )}
    </div>
  )
}

export default ThemeSelector