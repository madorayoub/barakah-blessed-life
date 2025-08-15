import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Calendar, TrendingUp, Target, Flame } from 'lucide-react'

interface PrayerAnalyticsProps {
  stats: {
    totalPrayers: number
    completedPrayers: number
    completionRate: number
    currentStreak: number
    longestStreak: number
    missedByPrayer: Record<string, number>
    weeklyData: { date: string; completed: number; total: number }[]
    monthlyHeatmap: { date: string; count: number }[]
  }
}

export function PrayerAnalytics({ stats }: PrayerAnalyticsProps) {
  const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
  
  const missedPrayersData = prayerNames.map(prayer => ({
    prayer,
    missed: stats.missedByPrayer[prayer.toLowerCase()] || 0
  }))

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-gray-100'
    if (count === 1) return 'bg-emerald-100'
    if (count === 2) return 'bg-emerald-200'
    if (count === 3) return 'bg-emerald-300'
    if (count === 4) return 'bg-emerald-400'
    return 'bg-emerald-500'
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.completionRate.toFixed(1)}%
            </div>
            <Progress value={stats.completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completedPrayers} of {stats.totalPrayers} prayers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.currentStreak}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.currentStreak === 1 ? 'day' : 'days'} consecutive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.weeklyData.reduce((sum, day) => sum + day.completed, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              prayers completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.longestStreak}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.longestStreak === 1 ? 'day' : 'days'} record
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Prayer Progress</CardTitle>
          <CardDescription>Your prayer completions this week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} prayers`,
                  name === 'completed' ? 'Completed' : 'Total'
                ]}
              />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Prayer Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missed Prayers by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Prayer Analysis</CardTitle>
            <CardDescription>Which prayers need more attention?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missedPrayersData.map((item, index) => (
                <div key={item.prayer} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-medium">{item.prayer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {item.missed} missed
                    </span>
                    {item.missed === 0 && (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                        Perfect
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Heatmap</CardTitle>
            <CardDescription>Prayer completion intensity this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {stats.monthlyHeatmap.map((day, index) => (
                <div
                  key={day.date}
                  className={`w-4 h-4 rounded-sm ${getHeatmapColor(day.count)}`}
                  title={`${day.date}: ${day.count} prayers`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4, 5].map(level => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm ${getHeatmapColor(level)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}