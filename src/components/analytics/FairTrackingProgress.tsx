import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Flame, Target, TrendingUp, Calendar, Info } from 'lucide-react'

interface FairTrackingProgressProps {
  daysSinceJoining: number
  fairProgress: number
  currentStreak: number
  barakahScore: number
  islamicMetrics: {
    prayerConsistency: number
    prayersOnTime: number
    overallSpirituality: number
  }
}

export function FairTrackingProgress({ 
  daysSinceJoining, 
  fairProgress, 
  currentStreak, 
  barakahScore,
  islamicMetrics 
}: FairTrackingProgressProps) {
  const isFairTrackingActive = daysSinceJoining <= 7
  
  const getBarakahLevel = (score: number) => {
    if (score >= 500) return { level: 'Exceptional', color: 'text-primary', bg: 'bg-primary/10' }
    if (score >= 300) return { level: 'Exemplary', color: 'text-accent-foreground', bg: 'bg-accent/10' }
    if (score >= 150) return { level: 'Devoted', color: 'text-primary', bg: 'bg-primary/10' }
    if (score >= 50) return { level: 'Committed', color: 'text-primary', bg: 'bg-primary/10' }
    return { level: 'Novice', color: 'text-muted-foreground', bg: 'bg-muted' }
  }

  const barakahLevel = getBarakahLevel(barakahScore)

  return (
    <div className="space-y-6">
      {/* Fair Tracking Banner */}
      {isFairTrackingActive && (
        <Card className="bg-card dark:bg-muted border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Info className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Fair Tracking Active</h3>
                <p className="text-sm text-primary">
                  Progress calculated from your join date (Day {daysSinceJoining}) - ensuring fair measurement!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Progress Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fair Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fair Progress</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {fairProgress.toFixed(1)}%
            </div>
            <Progress value={fairProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Since joining {daysSinceJoining} days ago
              {isFairTrackingActive && <span className="text-primary"> • Fair tracking</span>}
            </p>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">
              {currentStreak}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentStreak === 1 ? 'day' : 'days'} consecutive
            </p>
            <div className="mt-2">
              <Progress value={Math.min((currentStreak / 30) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Goal: 30 days</p>
            </div>
          </CardContent>
        </Card>

        {/* Barakah Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Barakah Score</CardTitle>
            <TrendingUp className={`h-4 w-4 ${barakahLevel.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${barakahLevel.color}`}>
              {Math.round(barakahScore)}
            </div>
            <Badge className={`mt-1 ${barakahLevel.bg} ${barakahLevel.color} border-current`}>
              {barakahLevel.level}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Islamic productivity measure
            </p>
          </CardContent>
        </Card>

        {/* Spiritual Development */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spiritual Growth</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {islamicMetrics.overallSpirituality.toFixed(0)}%
            </div>
            <Progress value={islamicMetrics.overallSpirituality} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Overall spiritual consistency
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Islamic Metrics Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Islamic Practice Metrics</CardTitle>
          <CardDescription>Detailed view of your spiritual practices and consistency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Prayer Consistency */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Prayer Consistency</span>
                <span className="text-sm text-muted-foreground">
                  {islamicMetrics.prayerConsistency.toFixed(1)}%
                </span>
              </div>
              <Progress value={islamicMetrics.prayerConsistency} className="h-2" />
            </div>

            {/* Prayers On Time */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Timely Prayers</span>
                <span className="text-sm text-muted-foreground">
                  {islamicMetrics.prayersOnTime.toFixed(1)}%
                </span>
              </div>
              <Progress value={islamicMetrics.prayersOnTime} className="h-2" />
            </div>

            {/* Overall Spirituality */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Spirituality</span>
                <span className="text-sm text-muted-foreground">
                  {islamicMetrics.overallSpirituality.toFixed(1)}%
                </span>
              </div>
              <Progress value={islamicMetrics.overallSpirituality} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}