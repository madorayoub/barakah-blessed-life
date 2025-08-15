import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Target, Trophy, Download } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { PrayerAnalytics } from '@/components/analytics/PrayerAnalytics'
import { TaskAnalytics } from '@/components/analytics/TaskAnalytics'
import { Achievements } from '@/components/analytics/Achievements'
import { ExportReport } from '@/components/analytics/ExportReport'

export default function Analytics() {
  const { 
    prayerStats, 
    taskStats, 
    achievements, 
    loading, 
    getMotivationalMessage, 
    getQuranVerse 
  } = useAnalytics()

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Progress Analytics</h1>
        <p className="text-muted-foreground">Track your spiritual journey and productivity growth</p>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-emerald-600" />
              <div>
                <div className="text-2xl font-bold text-emerald-700">
                  {prayerStats?.completionRate?.toFixed(0) || 0}%
                </div>
                <div className="text-sm text-emerald-600">Prayer Completion</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-700">
                  {taskStats?.completionRate?.toFixed(0) || 0}%
                </div>
                <div className="text-sm text-blue-600">Task Success</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-amber-600" />
              <div>
                <div className="text-2xl font-bold text-amber-700">
                  {achievements.filter(a => a.earned).length}
                </div>
                <div className="text-sm text-amber-600">Achievements</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="prayers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="prayers">Prayer Analytics</TabsTrigger>
          <TabsTrigger value="tasks">Task Analytics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="export">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="prayers">
          {prayerStats && <PrayerAnalytics stats={prayerStats} />}
        </TabsContent>

        <TabsContent value="tasks">
          {taskStats && <TaskAnalytics stats={taskStats} />}
        </TabsContent>

        <TabsContent value="achievements">
          <Achievements 
            achievements={achievements}
            motivationalMessage={getMotivationalMessage()}
            quranVerse={getQuranVerse()}
          />
        </TabsContent>

        <TabsContent value="export">
          <ExportReport 
            prayerStats={prayerStats}
            taskStats={taskStats}
            achievements={achievements}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}