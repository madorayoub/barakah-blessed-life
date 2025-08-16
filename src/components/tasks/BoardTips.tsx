import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function BoardTips() {
  const [isVisible, setIsVisible] = useState(() => {
    // Check localStorage to see if user has dismissed tips
    const dismissed = localStorage.getItem('boardTipsDismissed')
    return dismissed !== 'true'
  })

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('boardTipsDismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Plus className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">Quick Board Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Click any task card to view details and edit</li>
              <li>• Add tasks directly to specific columns</li>
              <li>• Use priority flags to organize important tasks</li>
            </ul>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6 text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}