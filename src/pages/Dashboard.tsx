import { LayoutDashboard, CheckSquare, Clock, Calendar, User, Check, X, BarChart3, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePrayerTimes } from "@/hooks/usePrayerTimes"
import { useTasks } from "@/contexts/TasksContext"
import { useAuth } from "@/hooks/useAuth"
import { formatPrayerTime, getNextPrayer, getTimeUntilPrayer } from "@/lib/prayerTimes"
import { getFairTrackingMessage, isFairTrackingActive } from "@/lib/fairTracking"
import { Link } from "react-router-dom"
import { AppHeader } from "@/components/AppHeader"

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const { prayerTimes, loading, isPrayerComplete, markPrayerComplete, unmarkPrayerComplete, completions } = usePrayerTimes()
  const { tasks, loading: tasksLoading } = useTasks()
  
  console.log('Dashboard render:', { user, prayerTimes, loading, tasks, tasksLoading })
  
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Bottom Navigation (visible on mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="flex items-center justify-around py-1">
          <Link to="/dashboard" className="flex flex-col items-center gap-1 p-2 text-primary">
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link to="/tasks" className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <CheckSquare className="h-5 w-5" />
            <span className="text-xs">Tasks</span>
          </Link>
          <Link to="/prayers" className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span className="text-xs">Prayers</span>
          </Link>
          <Link to="/quran" className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Qur'an</span>
          </Link>
          <Link to="/analytics" className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">Analytics</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <User className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <AppHeader 
        title="Dashboard" 
        subtitle={`Welcome back, ${user?.email?.split('@')[0] || 'User'}`} 
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Prayer Times Card */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Prayer Times
            </h2>
            
            {loading ? (
              <div className="space-y-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex justify-between animate-pulse">
                    <div className="h-4 w-16 bg-muted rounded"></div>
                    <div className="h-4 w-20 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : prayerTimes ? (
              <div className="space-y-3">
                {prayerTimes.prayers.map((prayer) => {
                  const nextPrayer = getNextPrayer(prayerTimes)
                  const isNext = nextPrayer?.name === prayer.name
                  const isComplete = isPrayerComplete(prayer.name)
                  
                  return (
                    <div 
                      key={prayer.name}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        isNext ? 'bg-primary/10 border border-primary/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => isComplete ? unmarkPrayerComplete(prayer.name) : markPrayerComplete(prayer.name)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isComplete 
                              ? 'bg-primary border-primary text-white' 
                              : 'border-muted-foreground hover:border-primary'
                          }`}
                        >
                          {isComplete && <Check className="h-3 w-3" />}
                        </button>
                        <span className={`font-medium ${isNext ? 'text-primary' : ''}`}>
                          {prayer.displayName}
                          {isNext && <span className="text-xs ml-2">({getTimeUntilPrayer(prayer.time)})</span>}
                        </span>
                      </div>
                      <span className={`text-sm ${isNext ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                        {formatPrayerTime(prayer.time)}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <p>Unable to load prayer times</p>
                <p className="text-xs mt-1">Please check your location settings</p>
              </div>
            )}
          </div>

          {/* Today's Tasks */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Today's Tasks
            </h2>
            <TasksSection />
          </div>

          {/* Progress Overview */}
          <ProgressSection />
        </div>
      </main>
    </div>
  )
}

// Components for cleaner code organization
function TasksSection() {
  const { getTodaysTasks, getCompletedTasksToday, completeTask, deleteTask, loading } = useTasks()
  const todaysTasks = getTodaysTasks()
  const completedToday = getCompletedTasksToday()

  if (loading) {
    return (
      <div className="space-y-3">
        {[1,2,3].map(i => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-4 h-4 rounded-full bg-muted"></div>
            <div className="h-4 bg-muted rounded flex-1"></div>
          </div>
        ))}
      </div>
    )
  }

  if (todaysTasks.length === 0 && completedToday.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        <p>No tasks for today</p>
        <p className="text-xs mt-1">Add some tasks to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Today's pending tasks */}
      {todaysTasks.slice(0, 3).map((task) => (
        <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
          <button
            onClick={() => completeTask(task.id)}
            className="w-4 h-4 rounded-full border-2 border-muted-foreground hover:border-primary transition-colors"
          />
          <span className="flex-1 text-sm">{task.title}</span>
          {task.priority === 'high' || task.priority === 'urgent' ? (
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
          ) : null}
        </div>
      ))}
      
      {/* Completed tasks for today */}
      {completedToday.slice(0, 2).map((task) => (
        <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg opacity-75">
          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
          </div>
          <span className="flex-1 text-sm line-through text-muted-foreground">{task.title}</span>
        </div>
      ))}

      {todaysTasks.length > 3 && (
        <div className="text-center pt-2">
          <Link to="/tasks" className="text-sm text-primary hover:underline">
            View all {todaysTasks.length} tasks
          </Link>
        </div>
      )}
    </div>
  )
}

function ProgressSection() {
  const { tasks } = useTasks()
  const { completions } = usePrayerTimes()
  const { user } = useAuth()
  
  if (!user) return null

  // Calculate fair progress tracking from user registration date
  const userCreatedAt = new Date(user.created_at)
  const now = new Date()
  const daysSinceJoining = Math.floor((now.getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24)) + 1
  
  // Calculate this week's stats (from user join date if mid-week join)
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  const weekTrackingStart = userCreatedAt > startOfWeek ? userCreatedAt : startOfWeek
  
  const thisWeekTasks = tasks.filter(task => {
    const taskDate = new Date(task.created_at)
    return taskDate >= weekTrackingStart
  })
  
  const completedThisWeek = thisWeekTasks.filter(task => task.status === 'completed').length
  const totalTasksThisWeek = thisWeekTasks.length
  
  // Fair prayer calculation - only count days since joining
  const daysInThisWeek = Math.floor((now.getTime() - weekTrackingStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const totalPrayersThisWeek = daysInThisWeek * 5 // 5 prayers per day since joining
  const completedPrayers = completions.length // Today's completed prayers (for demo)
  
  const prayerPercentage = totalPrayersThisWeek > 0 ? Math.round((completedPrayers / totalPrayersThisWeek) * 100) : 0
  const taskPercentage = totalTasksThisWeek > 0 ? Math.round((completedThisWeek / totalTasksThisWeek) * 100) : 0
  
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">
        Progress Since Joining
        <span className="text-xs text-muted-foreground block font-normal">
          Day {daysSinceJoining} of your spiritual journey
        </span>
      </h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Prayers Completed</span>
            <span>{completedPrayers}/{totalPrayersThisWeek}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{width: `${prayerPercentage}%`}}
            />
          </div>
          {isFairTrackingActive(daysSinceJoining) && (
            <p className="text-xs text-muted-foreground mt-1">
              {getFairTrackingMessage(daysSinceJoining)}
            </p>
          )}
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Tasks Completed</span>
            <span>{completedThisWeek}/{totalTasksThisWeek}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{width: `${taskPercentage}%`}}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Spiritual Goals</span>
            <span>3/5 days</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{width: '60%'}} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard