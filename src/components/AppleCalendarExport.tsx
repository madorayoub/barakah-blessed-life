import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Smartphone, Download, Clock, Settings2 } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useAppleCalendar } from '@/hooks/useAppleCalendar'

export function AppleCalendarExport() {
  const [syncOptions, setSyncOptions] = useState({
    includePrayers: true,
    includeTasks: true,
    days: 30,
    includeReminders: true,
    reminderMinutes: 10
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  const { generateAdvancedICS, isGenerating } = useAppleCalendar()

  const handleExport = async () => {
    await generateAdvancedICS(syncOptions)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-gray-600" />
          Apple Calendar Export
        </CardTitle>
        <CardDescription>
          Download .ics file for Apple Calendar, iPhone, iPad, and Mac
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium">Prayer Times</div>
              <div className="text-xs text-muted-foreground">5 daily prayers</div>
            </div>
            <Switch 
              checked={syncOptions.includePrayers}
              onCheckedChange={(checked) => setSyncOptions(prev => ({ ...prev, includePrayers: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium">Tasks & Goals</div>
              <div className="text-xs text-muted-foreground">Personal tasks</div>
            </div>
            <Switch 
              checked={syncOptions.includeTasks}
              onCheckedChange={(checked) => setSyncOptions(prev => ({ ...prev, includeTasks: checked }))}
            />
          </div>
        </div>

        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between" size="sm">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Advanced Options
              </div>
              <Badge variant="outline">{showAdvanced ? 'Less' : 'More'}</Badge>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Reminders</div>
                  <div className="text-xs text-muted-foreground">Get notifications before events</div>
                </div>
                <Switch 
                  checked={syncOptions.includeReminders}
                  onCheckedChange={(checked) => setSyncOptions(prev => ({ ...prev, includeReminders: checked }))}
                />
              </div>
              
              {syncOptions.includeReminders && (
                <div className="space-y-2 ml-4">
                  <div className="text-sm">Reminder: {syncOptions.reminderMinutes} minutes before</div>
                  <Slider
                    value={[syncOptions.reminderMinutes]}
                    onValueChange={([value]) => setSyncOptions(prev => ({ ...prev, reminderMinutes: value }))}
                    max={60}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="text-sm">Export duration: {syncOptions.days} days</div>
                <Slider
                  value={[syncOptions.days]}
                  onValueChange={([value]) => setSyncOptions(prev => ({ ...prev, days: value }))}
                  max={90}
                  min={7}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button 
          onClick={handleExport}
          disabled={isGenerating || (!syncOptions.includePrayers && !syncOptions.includeTasks)}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Generating Calendar File...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download .ics File
            </>
          )}
        </Button>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-900 mb-1">How to Import:</div>
          <div className="text-xs text-blue-700 space-y-1">
            <div>• iPhone/iPad: Tap the downloaded file</div>
            <div>• Mac: Double-click the file in Downloads</div>
            <div>• Choose "Barakah Tasks" calendar or create new</div>
            <div>• Events will appear in your Apple Calendar</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>✓ Works with Apple Calendar, iPhone, iPad, Mac</div>
          <div>✓ Includes prayer times with location</div>
          <div>✓ Custom reminder notifications</div>
          <div>✓ Islamic event categorization</div>
        </div>
      </CardContent>
    </Card>
  )
}