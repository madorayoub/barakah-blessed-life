import { useState } from 'react'
import { Clock, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatPrayerTime } from '@/lib/prayerTimes'

interface EditPrayerDialogProps {
  prayer: {
    id: string
    title: string
    time?: Date
    completed?: boolean
    isNext?: boolean
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPrayerComplete?: (prayerName: string) => void
}

export function EditPrayerDialog({ prayer, open, onOpenChange, onPrayerComplete }: EditPrayerDialogProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = async () => {
    if (!prayer || prayer.completed) return
    
    setIsCompleting(true)
    try {
      await onPrayerComplete?.(prayer.title)
      onOpenChange(false)
    } finally {
      setIsCompleting(false)
    }
  }

  const getPrayerInfo = (prayerName: string) => {
    const prayerDetails: { [key: string]: { icon: string, description: string, benefit: string } } = {
      'Fajr': {
        icon: '🌅',
        description: 'Dawn prayer - Start your day with gratitude and connection to Allah',
        benefit: 'Sets a peaceful tone for the entire day'
      },
      'Dhuhr': {
        icon: '🌞',
        description: 'Midday prayer - Pause and reflect during the busy day',
        benefit: 'Provides spiritual refreshment and mindfulness'
      },
      'Asr': {
        icon: '🌇',
        description: 'Afternoon prayer - Seek strength for the remainder of the day',
        benefit: 'Maintains spiritual focus as the day progresses'
      },
      'Maghrib': {
        icon: '🌆',
        description: 'Sunset prayer - Thank Allah for the blessings of the day',
        benefit: 'Cultivates gratitude and reflection'
      },
      'Isha': {
        icon: '🌙',
        description: 'Night prayer - End your day with peaceful prayers',
        benefit: 'Brings tranquility and prepares the soul for rest'
      }
    }
    return prayerDetails[prayerName] || { icon: '🕌', description: 'Prayer time', benefit: 'Spiritual connection' }
  }

  if (!prayer) return null

  const prayerInfo = getPrayerInfo(prayer.title)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{prayerInfo.icon}</span>
            {prayer.title} Prayer
          </DialogTitle>
          <DialogDescription>
            Prayer time details and completion
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Prayer Time */}
          {prayer.time && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Prayer Time</div>
                <div className="text-lg font-bold text-primary">
                  {formatPrayerTime(prayer.time)}
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              {prayer.completed ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    Completed ✓
                  </Badge>
                </>
              ) : prayer.isNext ? (
                <>
                  <Clock className="h-5 w-5 text-amber-600" />
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                    → Next Prayer
                  </Badge>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <Badge variant="outline">
                    Upcoming
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Prayer Description */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
            <div className="text-sm text-purple-800 mb-2 font-medium">
              About this Prayer
            </div>
            <div className="text-sm text-purple-700 mb-3">
              {prayerInfo.description}
            </div>
            <div className="text-xs text-purple-600 italic">
              💫 {prayerInfo.benefit}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            {!prayer.completed && (
              <Button 
                type="button"
                onClick={handleComplete}
                disabled={isCompleting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCompleting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Mark Complete
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}