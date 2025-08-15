import { LayoutDashboard, CheckSquare, Clock, Calendar, User } from "lucide-react"

const Dashboard = () => {
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
              <p className="text-muted-foreground">Welcome back, User</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6">
                <button className="text-primary font-medium">Dashboard</button>
                <button className="text-muted-foreground hover:text-foreground">Tasks</button>
                <button className="text-muted-foreground hover:text-foreground">Prayers</button>
                <button className="text-muted-foreground hover:text-foreground">Calendar</button>
                <button className="text-muted-foreground hover:text-foreground">Settings</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Prayer Times Card */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Prayer Times</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Fajr</span>
                <span className="text-muted-foreground">5:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Dhuhr</span>
                <span className="text-muted-foreground">12:45 PM</span>
              </div>
              <div className="flex justify-between text-primary font-medium">
                <span>Asr (Next)</span>
                <span>3:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Maghrib</span>
                <span className="text-muted-foreground">6:15 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Isha</span>
                <span className="text-muted-foreground">7:45 PM</span>
              </div>
            </div>
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