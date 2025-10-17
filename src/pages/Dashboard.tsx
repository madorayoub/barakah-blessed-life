import { LayoutDashboard, CheckSquare, Clock, User, Check, BarChart3, BookOpen } from "lucide-react"
import { usePrayerTimes } from "@/hooks/usePrayerTimes"
import { useTasks } from "@/contexts/TasksContext"
import { useAuth } from "@/hooks/useAuth"
import { formatPrayerTime, getNextPrayer, getTimeUntilPrayer } from "@/lib/prayerTimes"
import { getFairTrackingMessage, isFairTrackingActive } from "@/lib/fairTracking"
import { Link } from "react-router-dom"
import { AppHeader } from "@/components/AppHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const { prayerTimes, loading, isPrayerComplete, markPrayerComplete, unmarkPrayerComplete, completions } = usePrayerTimes()
  const { tasks, loading: tasksLoading } = useTasks()
  
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Bottom Navigation (visible on mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 supports-[backdrop-filter]:backdrop-blur md:hidden">
        <div className="flex items-center justify-around py-2">
          <Link to="/dashboard" className="flex flex-col items-center gap-1 p-2 text-primary">
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link to="/tasks" className="flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-foreground">
            <CheckSquare className="h-5 w-5" />
            <span className="text-xs">Tasks</span>
          </Link>
          <Link to="/prayers" className="flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-foreground">
            <Clock className="h-5 w-5" />
            <span className="text-xs">Prayers</span>
          </Link>
          <Link to="/quran" className="flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-foreground">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Qur'an</span>
          </Link>
          <Link to="/analytics" className="flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-foreground">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">Analytics</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-foreground">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Prayer Times Card */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Prayer Times
              </CardTitle>
              <p className="text-sm text-muted-foreground">Stay aligned with each prayer throughout the day</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between gap-6">
                      <div className="h-4 w-24 rounded bg-muted/50" />
                      <div className="h-4 w-20 rounded bg-muted/50" />
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
                        className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${
                          isNext
                            ? "border-primary/50 bg-primary/10 shadow-sm"
                            : "border-transparent bg-muted/40 hover:bg-muted/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              isComplete
                                ? unmarkPrayerComplete(prayer.name)
                                : markPrayerComplete(prayer.name)
                            }
                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                              isComplete
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:border-primary hover:bg-primary/10"
                            }`}
                          >
                            {isComplete && <Check className="h-3 w-3" />}
                          </button>
                          <div className="flex flex-col">
                            <span className={`text-sm font-medium ${isNext ? "text-primary" : "text-foreground"}`}>
                              {prayer.displayName}
                            </span>
                            {isNext && (
                              <span className="text-xs text-muted-foreground">{getTimeUntilPrayer(prayer.time)} remaining</span>
                            )}
                          </div>
                        </div>
                        <span className={`text-sm ${isNext ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                          {formatPrayerTime(prayer.time)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 py-6 text-center text-muted-foreground">
                  <p className="font-medium">Unable to load prayer times</p>
                  <p className="mt-1 text-xs">Please check your location settings</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckSquare className="h-5 w-5 text-primary" />
                Today's Tasks
              </CardTitle>
              <p className="text-sm text-muted-foreground">Quick actions for your most important work</p>
            </CardHeader>
            <CardContent>
              <TasksSection />
            </CardContent>
          </Card>

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
      <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 py-6 text-center text-muted-foreground">
        <p className="font-medium">No tasks for today</p>
        <p className="mt-1 text-xs">Add a task to start building momentum</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Today's pending tasks */}
      {todaysTasks.slice(0, 3).map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 rounded-xl border border-transparent bg-muted/30 p-3 transition-colors hover:border-primary/40 hover:bg-muted/60"
        >
          <button
            onClick={() => completeTask(task.id)}
            className="h-5 w-5 rounded-full border-2 border-border transition-all hover:border-primary hover:bg-primary/10"
          />
          <span className="flex-1 text-sm">{task.title}</span>
          {task.priority === 'high' || task.priority === 'urgent' ? (
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
          ) : null}
        </div>
      ))}

      {/* Completed tasks for today */}
      {completedToday.slice(0, 2).map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 rounded-xl border border-transparent bg-muted/20 p-3 text-muted-foreground"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-3 w-3" />
          </div>
          <span className="flex-1 text-sm line-through text-muted-foreground">{task.title}</span>
        </div>
      ))}

      {todaysTasks.length > 3 && (
        <div className="text-center pt-2">
          <Link to="/tasks" className="text-sm text-muted-foreground transition-colors hover:text-primary">
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

  const thisWeekTasks = tasks.filter((task) => {
    const taskDate = new Date(task.created_at)
    return taskDate >= weekTrackingStart
  })

  const completedThisWeek = thisWeekTasks.filter((task) => task.status === "completed").length
  const totalTasksThisWeek = thisWeekTasks.length

  // Fair prayer calculation - only count days since joining
  const daysInThisWeek = Math.floor((now.getTime() - weekTrackingStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const totalPrayersThisWeek = daysInThisWeek * 5 // 5 prayers per day since joining
  const completedPrayers = completions.length // Today's completed prayers (for demo)

  const prayerPercentage = totalPrayersThisWeek > 0 ? Math.round((completedPrayers / totalPrayersThisWeek) * 100) : 0
  const taskPercentage = totalTasksThisWeek > 0 ? Math.round((completedThisWeek / totalTasksThisWeek) * 100) : 0

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Progress Since Joining</CardTitle>
        <p className="text-xs text-muted-foreground">Day {daysSinceJoining} of your spiritual journey</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Prayers Completed</span>
            <span>
              {completedPrayers}/{totalPrayersThisWeek}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${prayerPercentage}%` }}
            />
          </div>
          {isFairTrackingActive(daysSinceJoining) && (
            <p className="mt-1 text-xs text-muted-foreground">
              {getFairTrackingMessage(daysSinceJoining)}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Tasks Completed</span>
            <span>
              {completedThisWeek}/{totalTasksThisWeek}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${taskPercentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Spiritual Goals</span>
            <span>3/5 days</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary" style={{ width: "60%" }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Dashboard
