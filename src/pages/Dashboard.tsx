import { LayoutDashboard, CheckSquare, Clock, Calendar, User, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePrayerTimes } from "@/hooks/usePrayerTimes"
import { useAuth } from "@/hooks/useAuth"
import { formatPrayerTime, getNextPrayer, getTimeUntilPrayer } from "@/lib/prayerTimes"
import { Link } from "react-router-dom"

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const { prayerTimes, loading, isPrayerComplete, markPrayerComplete, unmarkPrayerComplete } = usePrayerTimes()
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Bottom Navigation (visible on mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center gap-1 p-2 text-primary">
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <CheckSquare className="h-5 w-5" />
            <span className="text-xs">Tasks</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span className="text-xs">Prayers</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Calendar</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.email?.split('@')[0] || 'User'}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-primary font-medium">Dashboard</Link>
                <Link to="/tasks" className="text-muted-foreground hover:text-foreground">Tasks</Link>
                <Link to="/prayers" className="text-muted-foreground hover:text-foreground">Prayers</Link>
                <Link to="/calendar" className="text-muted-foreground hover:text-foreground">Calendar</Link>
                <Link to="/settings" className="text-muted-foreground hover:text-foreground">Settings</Link>
              </div>
              <Button onClick={signOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

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
            <h2 className="text-lg font-semibold mb-4">Today's Tasks</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-primary"></div>
                <span className="line-through text-muted-foreground">Morning dhikr</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-primary"></div>
                <span className="line-through text-muted-foreground">Read Quran</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-muted"></div>
                <span>Complete work project</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-muted"></div>
                <span>Evening dhikr</span>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">This Week</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Prayers Completed</span>
                  <span>32/35</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '91%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Quran Reading</span>
                  <span>5/7 days</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '71%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tasks Completed</span>
                  <span>18/24</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard