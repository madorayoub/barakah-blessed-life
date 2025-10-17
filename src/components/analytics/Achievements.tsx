import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Star, Award, Target } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: Date
  progress?: number
  target?: number
}

interface AchievementsProps {
  achievements: Achievement[]
  motivationalMessage: string
  quranVerse: string
}

export function Achievements({ achievements, motivationalMessage, quranVerse }: AchievementsProps) {
  const earnedAchievements = achievements.filter(a => a.earned)
  const inProgressAchievements = achievements.filter(a => !a.earned)

  return (
    <div className="space-y-6">
      {/* Motivational Header */}
      <Card className="bg-card dark:bg-muted border border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-foreground">Your Spiritual Journey</CardTitle>
              <CardDescription className="text-muted-foreground">
                {motivationalMessage}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-card/80 dark:bg-muted/80 p-4 rounded-lg border border-border">
            <p className="text-sm text-primary font-medium italic">
              {quranVerse}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {earnedAchievements.length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {achievements.length} unlocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {inProgressAchievements.length}
            </div>
            <p className="text-xs text-muted-foreground">
              achievements to unlock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Award className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {Math.round((earnedAchievements.length / achievements.length) * 100)}%
            </div>
            <Progress 
              value={(earnedAchievements.length / achievements.length) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              Earned Achievements
            </CardTitle>
            <CardDescription>Celebrate your spiritual milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 border rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-amber-900">{achievement.title}</h3>
                        <Badge className="bg-amber-200 text-amber-800 border-amber-300">
                          Earned
                        </Badge>
                      </div>
                      <p className="text-sm text-amber-700 mb-2">
                        {achievement.description}
                      </p>
                      {achievement.progress !== undefined && achievement.target && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-amber-600">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.target}</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* In Progress Achievements */}
      {inProgressAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Goals to Achieve
            </CardTitle>
            <CardDescription>Keep working towards these milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inProgressAchievements.map((achievement) => {
                const progressPercentage = achievement.progress && achievement.target 
                  ? (achievement.progress / achievement.target) * 100 
                  : 0
                
                return (
                  <div
                    key={achievement.id}
                    className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl opacity-60">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-blue-900">{achievement.title}</h3>
                          <Badge variant="outline" className="border-blue-300 text-blue-700">
                            {Math.round(progressPercentage)}%
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-700 mb-2">
                          {achievement.description}
                        </p>
                        {achievement.progress !== undefined && achievement.target && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-blue-600">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.target}</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}