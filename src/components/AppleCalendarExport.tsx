import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Smartphone, Download, Clock, Settings2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
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

  const { 
    isSubscribed,
    subscriptionUrl,
    lastSync,
    isGenerating,
    createSubscription,
    disconnectSubscription,
    syncNow,
    generateAdvancedICS
  } = useAppleCalendar()

  const handleConnect = async () => {
    if (isSubscribed) {
      await syncNow()
    } else {
      await createSubscription()
    }
  }

  const handleExport = async () => {
    await generateAdvancedICS(syncOptions)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-muted-foreground" />
          Apple Calendar Integration
        </CardTitle>
        <CardDescription>
          Real-time sync with Apple Calendar using live subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-medium">Connection Status</div>
            <div className="text-sm text-muted-foreground">
              {isSubscribed ? 'Connected with live subscription' : 'Not connected'}
            </div>
          </div>
          <Badge variant={isSubscribed ? "default" : "secondary"}>
            {isSubscribed ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Disconnected
              </>
            )}
          </Badge>
        </div>

        {/* Subscription Details */}
        {isSubscribed && subscriptionUrl && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm font-medium text-green-900">
              Live Subscription Active
            </div>
            <div className="text-xs text-green-700 mt-1">
              URL: {subscriptionUrl.substring(0, 40)}...
            </div>
            {lastSync && (
              <div className="text-xs text-green-600 mt-1">
                Last synced: {lastSync.toLocaleString()}
              </div>
            )}
          </div>
        )}
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

        {/* Main Action Button */}
        <div className="space-y-2">
          <Button 
            onClick={handleConnect}
            disabled={isGenerating}
            className="w-full"
            variant={isSubscribed ? "default" : "outline"}
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                {isSubscribed ? "Syncing..." : "Connecting..."}
              </>
            ) : (
              <>
                {isSubscribed ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </>
                ) : (
                  <>
                    <Smartphone className="h-4 w-4 mr-2" />
                    Connect Apple Calendar
                  </>
                )}
              </>
            )}
          </Button>

          {isSubscribed && (
            <Button 
              onClick={disconnectSubscription}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Disconnect Apple Calendar
            </Button>
          )}
        </div>

        {/* Manual Export Option */}
        <div className="border-t pt-4">
          <div className="text-sm font-medium mb-2">Manual Export (Alternative)</div>
          <Button 
            onClick={handleExport}
            disabled={isGenerating || (!syncOptions.includePrayers && !syncOptions.includeTasks)}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download .ics File
              </>
            )}
          </Button>
        </div>

        {/* Enhanced Features Info */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-900 mb-1">
            {isSubscribed ? 'Live Subscription Features:' : 'Apple Calendar Features:'}
          </div>
          <div className="text-xs text-blue-700 space-y-1">
            {isSubscribed ? (
              <>
                <div>• Automatic sync every hour</div>
                <div>• Real-time updates when you change settings</div>
                <div>• Works across all Apple devices</div>
                <div>• No manual re-importing needed</div>
              </>
            ) : (
              <>
                <div>• Connect for automatic live sync</div>
                <div>• Works with iPhone, iPad, Mac</div>
                <div>• Custom reminder notifications</div>
                <div>• Islamic event categorization</div>
              </>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>✓ Real-time subscription sync (like Google Calendar)</div>
          <div>✓ Automatic prayer time updates</div>
          <div>✓ Cross-device synchronization</div>
          <div>✓ Islamic calendar integration</div>
        </div>
      </CardContent>
    </Card>
  )
}