import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, TrendingUp, Target } from 'lucide-react'

interface TaskAnalyticsProps {
  stats: {
    totalTasks: number
    completedTasks: number
    completionRate: number
    byCategory: { category: string; completed: number; total: number }[]
    weeklyTrend: { week: string; completed: number }[]
  }
}

const COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
]

export function TaskAnalytics({ stats }: TaskAnalyticsProps) {

  const categoryCompletionData = stats.byCategory.map(cat => ({
    category: cat.category,
    completionRate: cat.total > 0 ? (cat.completed / cat.total) * 100 : 0,
    completed: cat.completed,
    total: cat.total
  }))

  const pendingTasks = stats.totalTasks - stats.completedTasks

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              tasks this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.completedTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              tasks finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              tasks remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.completionRate.toFixed(1)}%
            </div>
            <Progress value={stats.completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Category Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Category</CardTitle>
            <CardDescription>Distribution of completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.byCategory.map((category, index) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium">{category.category}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {category.completed} tasks
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: COLORS[index % COLORS.length],
                        width: `${category.total > 0 ? (category.completed / category.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Completion rates by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryCompletionData.map((item, index) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(item.completionRate)}%
                    </span>
                  </div>
                  <Progress value={item.completionRate} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Details */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Detailed view of task progress by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.byCategory.map((category, index) => {
              const completionRate = category.total > 0 ? (category.completed / category.total) * 100 : 0
              return (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{category.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {category.completed}/{category.total}
                      </span>
                      <Badge 
                        variant={completionRate >= 80 ? "default" : completionRate >= 50 ? "secondary" : "outline"}
                        className={
                          completionRate >= 80 
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                            : completionRate >= 50 
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {Math.round(completionRate)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}