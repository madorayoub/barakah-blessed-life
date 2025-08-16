import { 
  LayoutDashboard, 
  CheckSquare, 
  Clock, 
  Calendar, 
  User, 
  Check, 
  BarChart3, 
  Plus,
  BookOpen,
  Target,
  TrendingUp,
  Star,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePrayerTimes } from "@/hooks/usePrayerTimes"
import { useTasks } from "@/hooks/useTasks"
import { useAuth } from "@/hooks/useAuth"
import { formatPrayerTime, getNextPrayer, getTimeUntilPrayer } from "@/lib/prayerTimes"
import { Link } from "react-router-dom"
import { NewTaskDialog } from "@/components/NewTaskDialog"

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const { prayerTimes, loading, isPrayerComplete, markPrayerComplete, unmarkPrayerComplete, completions } = usePrayerTimes()
  const { tasks, loading: tasksLoading } = useTasks()
  
  // Get Arabic greeting based on time of day
  const getArabicGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "صباح الخير" // Good morning
    if (hour < 17) return "السلام عليكم" // Peace be upon you
    return "مساء الخير" // Good evening
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sacred md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          <Link to="/dashboard" className="flex flex-col items-center gap-1 p-3 text-primary">
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>
          <Link to="/tasks" className="flex flex-col items-center gap-1 p-3 text-muted-foreground hover:text-primary transition-colors">
            <CheckSquare className="h-5 w-5" />
            <span className="text-xs">Tasks</span>
          </Link>
          <Link to="/prayers" className="flex flex-col items-center gap-1 p-3 text-muted-foreground hover:text-primary transition-colors">
            <Clock className="h-5 w-5" />
            <span className="text-xs">Prayers</span>
          </Link>
          <Link to="/calendar" className="flex flex-col items-center gap-1 p-3 text-muted-foreground hover:text-primary transition-colors">
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Calendar</span>
          </Link>
          <Link to="/analytics" className="flex flex-col items-center gap-1 p-3 text-muted-foreground hover:text-primary transition-colors">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">Analytics</span>
          </Link>
        </div>
      </nav>

      {/* Header with Islamic design */}
      <header className="bg-white border-b shadow-sacred relative overflow-hidden">
        {/* Subtle Islamic geometric pattern */}
        <div className="absolute inset-0 pattern-geometric opacity-30"></div>
        
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-lg font-medium text-gold-600">{getArabicGreeting()}</div>
              <h1 className="text-2xl font-bold text-foreground">Barakah Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.email?.split('@')[0] || 'Believer'}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-primary font-medium hover:text-primary-dark transition-colors">
                  Dashboard
                </Link>
                <Link to="/tasks" className="text-muted-foreground hover:text-primary transition-colors">
                  Tasks
                </Link>
                <Link to="/prayers" className="text-muted-foreground hover:text-primary transition-colors">
                  Prayers
                </Link>
                <Link to="/calendar" className="text-muted-foreground hover:text-primary transition-colors">
                  Calendar
                </Link>
                <Link to="/analytics" className="text-muted-foreground hover:text-primary transition-colors">
                  Analytics
                </Link>
                <Link to="/settings" className="text-muted-foreground hover:text-primary transition-colors">
                  Settings
                </Link>
              </div>
              
              <Button onClick={signOut} variant="outline" size="sm" className="shadow-sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Prayer Times Card - Large */}
          <Card className="lg:col-span-5 shadow-blessed hover:shadow-divine transition-all duration-300 animate-gentle-float">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-emerald-700">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-semibold">Prayer Times</div>
                  <div className="text-sm text-muted-foreground font-normal">Stay connected with Allah</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PrayerTimesSection 
                prayerTimes={prayerTimes} 
                loading={loading} 
                isPrayerComplete={isPrayerComplete}
                markPrayerComplete={markPrayerComplete}
                unmarkPrayerComplete={unmarkPrayerComplete}
              />
            </CardContent>
          </Card>

          {/* Today's Tasks Card */}
          <Card className="lg:col-span-4 shadow-blessed hover:shadow-divine transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-emerald-700">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Today's Tasks</div>
                    <div className="text-sm text-muted-foreground font-normal">Your daily goals</div>
                  </div>
                </div>
                <NewTaskDialog>
                  <Button size="sm" className="bg-primary hover:bg-primary-dark shadow-sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </NewTaskDialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TasksSection />
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="lg:col-span-3 shadow-blessed hover:shadow-divine transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-emerald-700">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-gold-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold">Progress</div>
                  <div className="text-sm text-muted-foreground font-normal">Your spiritual journey</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressSection />
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="lg:col-span-6 shadow-blessed hover:shadow-divine transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-emerald-700">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-gold-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold">Quick Actions</div>
                  <div className="text-sm text-muted-foreground font-normal">Get things done faster</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuickActionsSection />
            </CardContent>
          </Card>

          {/* Spiritual Goals Card */}
          <Card className="lg:col-span-6 shadow-blessed hover:shadow-divine transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-emerald-700">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-semibold">Spiritual Goals</div>
                  <div className="text-sm text-muted-foreground font-normal">This week's focus</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpiritualGoalsSection />
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}

// Prayer Times Component
function PrayerTimesSection({ prayerTimes, loading, isPrayerComplete, markPrayerComplete, unmarkPrayerComplete }: any) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex justify-between items-center animate-pulse p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!prayerTimes) {
    return (
      <div className="text-center text-muted-foreground py-8 space-y-2">
        <Clock className="h-12 w-12 mx-auto text-gray-300" />
        <p className="font-medium">Unable to load prayer times</p>
        <p className="text-sm">Please check your location settings</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {prayerTimes.prayers.map((prayer: any) => {
        const nextPrayer = getNextPrayer(prayerTimes)
        const isNext = nextPrayer?.name === prayer.name
        const isComplete = isPrayerComplete(prayer.name)
        
        return (
          <div 
            key={prayer.name}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              isNext 
                ? 'bg-gradient-to-r from-primary/10 to-gold-400/10 border border-primary/20 animate-prayer-pulse' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => isComplete ? unmarkPrayerComplete(prayer.name) : markPrayerComplete(prayer.name)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isComplete 
                    ? 'bg-primary border-primary text-white shadow-sm' 
                    : 'border-gray-300 hover:border-primary hover:shadow-sm'
                }`}
              >
                {isComplete && <Check className="h-3 w-3" />}
              </button>
              <div>
                <span className={`font-medium ${isNext ? 'text-primary' : 'text-foreground'}`}>
                  {prayer.displayName}
                </span>
                {isNext && (
                  <div className="text-xs text-gold-600 font-medium">
                    ← Next prayer ({getTimeUntilPrayer(prayer.time)})
                  </div>
                )}
              </div>
            </div>
            <span className={`text-sm font-mono ${
              isNext ? 'font-semibold text-primary' : 'text-muted-foreground'
            }`}>
              {formatPrayerTime(prayer.time)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Tasks Section Component
function TasksSection() {
  const { getTodaysTasks, getCompletedTasksToday, completeTask, loading } = useTasks()
  const todaysTasks = getTodaysTasks()
  const completedToday = getCompletedTasksToday()

  if (loading) {
    return (
      <div className="space-y-3">
        {[1,2,3].map(i => (
          <div key={i} className="flex items-center gap-3 animate-pulse p-2 rounded">
            <div className="w-5 h-5 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
          </div>
        ))}
      </div>
    )
  }

  if (todaysTasks.length === 0 && completedToday.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6 space-y-3">
        <CheckSquare className="h-10 w-10 mx-auto text-gray-300" />
        <p className="font-medium">No tasks for today</p>
        <NewTaskDialog>
          <Button size="sm" variant="outline" className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add your first task
          </Button>
        </NewTaskDialog>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Pending tasks */}
      {todaysTasks.slice(0, 4).map((task) => (
        <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <button
            onClick={() => completeTask(task.id)}
            className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-primary transition-colors flex-shrink-0"
          />
          <span className="flex-1 text-sm font-medium truncate">{task.title}</span>
          {(task.priority === 'high' || task.priority === 'urgent') && (
            <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
          )}
        </div>
      ))}
      
      {/* Completed tasks */}
      {completedToday.slice(0, 2).map((task) => (
        <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg opacity-60">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Check className="h-3 w-3 text-white" />
          </div>
          <span className="flex-1 text-sm line-through text-muted-foreground truncate">{task.title}</span>
        </div>
      ))}

      {todaysTasks.length > 4 && (
        <div className="pt-2 text-center">
          <Link to="/tasks" className="text-sm text-primary hover:text-primary-dark font-medium">
            View all {todaysTasks.length} tasks →
          </Link>
        </div>
      )}
    </div>
  )
}

// Progress Section Component
function ProgressSection() {
  const { tasks } = useTasks()
  const { completions } = usePrayerTimes()
  const { user } = useAuth()
  
  if (!user) return null

  // Calculate fair progress from user join date
  const userCreatedAt = new Date(user.created_at)
  const now = new Date()
  const daysSinceJoining = Math.floor((now.getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24)) + 1
  
  const completedTasksToday = tasks.filter(task => {
    if (!task.completed_at) return false
    const completedDate = new Date(task.completed_at).toDateString()
    return completedDate === now.toDateString()
  }).length
  
  const todayPrayersCompleted = completions.length
  const totalPrayersToday = 5

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-gold-600">{daysSinceJoining}</div>
        <div className="text-xs text-muted-foreground">Days on your journey</div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Today's Prayers</span>
            <span className="text-primary font-semibold">{todayPrayersCompleted}/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-emerald-700 h-2 rounded-full transition-all duration-500" 
              style={{width: `${(todayPrayersCompleted / totalPrayersToday) * 100}%`}}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Tasks Completed</span>
            <span className="text-primary font-semibold">{completedTasksToday}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-gold-500 to-gold-600 h-2 rounded-full transition-all duration-500" 
              style={{width: `${Math.min(completedTasksToday * 20, 100)}%`}}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Weekly Goals</span>
            <span className="text-primary font-semibold">4/7</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 h-2 rounded-full" style={{width: '57%'}} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Quick Actions Section
function QuickActionsSection() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <NewTaskDialog>
        <Button variant="outline" className="h-16 flex-col gap-2 shadow-sm hover:shadow-blessed transition-all">
          <Plus className="h-5 w-5" />
          <span className="text-sm">Add Task</span>
        </Button>
      </NewTaskDialog>
      
      <Link to="/prayers">
        <Button variant="outline" className="h-16 flex-col gap-2 w-full shadow-sm hover:shadow-blessed transition-all">
          <Clock className="h-5 w-5" />
          <span className="text-sm">Prayer Times</span>
        </Button>
      </Link>
      
      <Link to="/calendar">
        <Button variant="outline" className="h-16 flex-col gap-2 w-full shadow-sm hover:shadow-blessed transition-all">
          <Calendar className="h-5 w-5" />
          <span className="text-sm">Calendar</span>
        </Button>
      </Link>
      
      <Link to="/analytics">
        <Button variant="outline" className="h-16 flex-col gap-2 w-full shadow-sm hover:shadow-blessed transition-all">
          <BarChart3 className="h-5 w-5" />
          <span className="text-sm">Analytics</span>
        </Button>
      </Link>
    </div>
  )
}

// Spiritual Goals Section
function SpiritualGoalsSection() {
  const goals = [
    { name: "Daily Dhikr", completed: 5, total: 7, icon: "🤲" },
    { name: "Quran Reading", completed: 3, total: 7, icon: "📖" },
    { name: "Charity Acts", completed: 2, total: 3, icon: "💝" },
  ]

  return (
    <div className="space-y-3">
      {goals.map((goal, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{goal.icon}</span>
              <span className="text-sm font-medium">{goal.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">{goal.completed}/{goal.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-primary to-emerald-700 h-1.5 rounded-full transition-all" 
              style={{width: `${(goal.completed / goal.total) * 100}%`}}
            />
          </div>
        </div>
      ))}
      
      <div className="pt-2 text-center">
        <Link to="/analytics" className="text-sm text-primary hover:text-primary-dark font-medium">
          View detailed progress →
        </Link>
      </div>
    </div>
  )
}

export default Dashboard