import { useEffect, useState } from 'react'
import { CheckCircle, Star, Flame, Trophy, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TaskCompletionRewardProps {
  taskTitle: string
  isVisible: boolean
  onComplete: () => void
  streak?: number
  isIslamicTask?: boolean
}

export function TaskCompletionReward({ 
  taskTitle, 
  isVisible, 
  onComplete, 
  streak = 0,
  isIslamicTask = false 
}: TaskCompletionRewardProps) {
  const [showReward, setShowReward] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShowReward(true)
      const timer = setTimeout(() => {
        setShowReward(false)
        onComplete()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  const getRewardMessage = () => {
    if (isIslamicTask) {
      if (streak >= 7) return "🎉 Subhan'Allah! 7-day streak!"
      if (streak >= 3) return "✨ Barakallahu feeki!"
      return "🤲 Alhamdulillah!"
    }
    
    if (streak >= 7) return "🔥 Amazing 7-day streak!"
    if (streak >= 3) return "⭐ Great consistency!"
    return "✅ Well done!"
  }

  const getIslamicQuote = () => {
    const quotes = [
      "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
      "Allah will make a way out for those who are mindful of Him",
      "The best of deeds are those done consistently",
      "Small consistent actions are better than large inconsistent ones"
    ]
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  return (
    <AnimatePresence>
      {showReward && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.3 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            duration: 0.6 
          }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg max-w-sm">
            <div className="text-center space-y-3">
              {/* Celebration Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </motion.div>

              {/* Reward Message */}
              <div>
                <h3 className="font-semibold text-green-800">
                  {getRewardMessage()}
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  "{taskTitle}" completed
                </p>
              </div>

              {/* Streak Badge */}
              {streak > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center"
                >
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                    <Flame className="h-3 w-3 mr-1" />
                    {streak} day streak!
                  </Badge>
                </motion.div>
              )}

              {/* Islamic Quote */}
              {isIslamicTask && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xs text-green-600 italic mt-2 leading-relaxed"
                >
                  {getIslamicQuote()}
                </motion.p>
              )}

              {/* Floating Particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -30, -60],
                    x: [0, Math.random() * 40 - 20]
                  }}
                  transition={{ 
                    delay: 0.8 + i * 0.1,
                    duration: 2,
                    ease: "easeOut"
                  }}
                  className="absolute top-0 left-1/2"
                >
                  <Star className="h-3 w-3 text-yellow-400" />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}