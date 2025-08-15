import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
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
  const pieData = stats.byCategory.map((cat, index) => ({
    name: cat.category,
    value: cat.completed,
    total: cat.total,
    color: COLORS[index % COLORS.length]
  }))

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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Category</CardTitle>
            <CardDescription>Distribution of completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} tasks`,
                    props.payload.name
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Completion rates by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryCompletionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis 
                  type="category" 
                  dataKey="category" 
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${typeof value === 'number' ? value.toFixed(1) : value}%`, 'Completion Rate']}
                />
                <Bar 
                  dataKey="completionRate" 
                  fill="#10b981" 
                  radius={[0, 4, 4, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
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