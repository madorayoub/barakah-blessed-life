import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Flame, 
  Calendar, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Trophy, 
  BookOpen, 
  Target, 
  Download, 
  Eye,
  ArrowLeft 
} from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { PrayerAnalytics } from '@/components/analytics/PrayerAnalytics'
import { TaskAnalytics } from '@/components/analytics/TaskAnalytics'
import { Achievements } from '@/components/analytics/Achievements'
import { ExportReport } from '@/components/analytics/ExportReport'

export default function Analytics() {
  const navigate = useNavigate()
  const { 
    prayerStats, 
    taskStats, 
    achievements, 
    loading, 
    getMotivationalMessage, 
    getQuranVerse,
    getDaysSinceJoining
  } = useAnalytics()

  const [expandedSections, setExpandedSections] = useState({
    prayers: false,
    spiritual: false,
    tasks: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p>Loading your analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  const todayPrayers = prayerStats?.weeklyData?.[prayerStats.weeklyData.length - 1]?.completed || 0
  const totalDailyPrayers = 5
  const currentStreak = prayerStats?.currentStreak || 0
  const weeklyCompletion = prayerStats?.weeklyData?.reduce((acc, day) => acc + day.completed, 0) || 0
  const totalWeeklyPrayers = prayerStats?.weeklyData?.reduce((acc, day) => acc + day.total, 0) || 35
  const weeklyProgress = totalWeeklyPrayers > 0 ? (weeklyCompletion / totalWeeklyPrayers) * 100 : 0
  const daysSinceJoining = getDaysSinceJoining()

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Header with Back Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="h-4 w-px bg-border" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your spiritual progress</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-4 md:space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Your Spiritual Journey</h2>
          <p className="text-muted-foreground">
            Day {daysSinceJoining} of your journey • Fair tracking from your join date
          </p>
        </div>

        {/* Daily Progress Circle */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
          <svg className="w-24 h-24 md:w-32 md:h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(todayPrayers / totalDailyPrayers) * 283} 283`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xl md:text-2xl font-bold">{todayPrayers}/{totalDailyPrayers}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Today's Prayers</div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
                <Flame className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                <span className="text-lg md:text-2xl font-bold">{currentStreak}</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-3 md:p-4">
              <div className="mb-1 md:mb-2">
                <span className="text-lg md:text-2xl font-bold">{weeklyProgress.toFixed(0)}%</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Since Joining</p>
              <Progress value={weeklyProgress} className="h-1.5 md:h-2 mt-1 md:mt-2" />
              {daysSinceJoining <= 7 && (
                <p className="text-xs text-green-600 mt-1">Fair tracking!</p>
              )}
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
                <Trophy className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
                <span className="text-lg md:text-2xl font-bold">{achievements.filter(a => a.earned).length}</span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">Achievements</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Insights - 3 Expandable Cards */}
      <div className="space-y-4 md:space-y-6">
        {/* Prayer Patterns Card */}
        <Card>
          <Collapsible open={expandedSections.prayers} onOpenChange={() => toggleSection('prayers')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
                    <div>
                      <CardTitle className="text-base md:text-lg">Prayer Patterns</CardTitle>
                      <CardDescription className="text-sm">
                        {prayerStats?.completionRate?.toFixed(0) || 0}% completion rate since joining
                        {daysSinceJoining <= 7 && " • Fair tracking active"}
                      </CardDescription>
                    </div>
                  </div>
                  {expandedSections.prayers ? <ChevronUp className="h-4 w-4 md:h-5 md:w-5" /> : <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {prayerStats && <PrayerAnalytics stats={prayerStats} />}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Spiritual Growth Card */}
        <Card>
          <Collapsible open={expandedSections.spiritual} onOpenChange={() => toggleSection('spiritual')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-base md:text-lg">Spiritual Growth</CardTitle>
                      <CardDescription className="text-sm">
                        Track your Islamic practices and habits
                      </CardDescription>
                    </div>
                  </div>
                  {expandedSections.spiritual ? <ChevronUp className="h-4 w-4 md:h-5 md:w-5" /> : <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <Achievements 
                  achievements={achievements}
                  motivationalMessage={getMotivationalMessage()}
                  quranVerse={getQuranVerse()}
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Task Productivity Card */}
        <Card>
          <Collapsible open={expandedSections.tasks} onOpenChange={() => toggleSection('tasks')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                    <div>
                      <CardTitle className="text-base md:text-lg">Task Productivity</CardTitle>
                      <CardDescription className="text-sm">
                        {taskStats?.completionRate?.toFixed(0) || 0}% task completion rate
                      </CardDescription>
                    </div>
                  </div>
                  {expandedSections.tasks ? <ChevronUp className="h-4 w-4 md:h-5 md:w-5" /> : <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {taskStats && <TaskAnalytics stats={taskStats} />}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>

      {/* Actions Section */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4" />
              View Detailed Reports
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detailed Analytics Report</DialogTitle>
              <DialogDescription>
                Comprehensive view of your spiritual journey and productivity
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {prayerStats && <PrayerAnalytics stats={prayerStats} />}
              {taskStats && <TaskAnalytics stats={taskStats} />}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 text-sm">
              <Download className="h-4 w-4" />
              Export Progress Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Export Progress Report</DialogTitle>
              <DialogDescription>
                Generate and download your spiritual journey report
              </DialogDescription>
            </DialogHeader>
            <ExportReport 
              prayerStats={prayerStats}
              taskStats={taskStats}
              achievements={achievements}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Motivational Footer */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-4 md:p-6 text-center">
          <h3 className="text-base md:text-lg font-semibold mb-2">{getMotivationalMessage()}</h3>
          <p className="text-sm md:text-base text-muted-foreground italic">"{getQuranVerse()}"</p>
        </CardContent>
      </Card>
    </div>
  )
}