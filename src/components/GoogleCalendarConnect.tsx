import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Globe, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar'

export function GoogleCalendarConnect() {
  const {
    isInitialized,
    isAuthorized,
    isLoading,
    signIn,
    signOut,
    syncAll,
    calendarId
  } = useGoogleCalendar()

  const [lastSync, setLastSync] = useState<Date | null>(null)

  const handleSync = async () => {
    if (isAuthorized) {
      await syncAll()
      setLastSync(new Date())
    } else {
      await signIn()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Google Calendar Integration
        </CardTitle>
        <CardDescription>
          Sync your prayer times and tasks with Google Calendar in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isInitialized && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Loading Google Calendar integration...
            </AlertDescription>
          </Alert>
        )}

        {isInitialized && (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Connection Status</div>
                <div className="text-sm text-muted-foreground">
                  {isAuthorized ? 'Connected to your Google account' : 'Not connected'}
                </div>
              </div>
              <Badge variant={isAuthorized ? "default" : "secondary"}>
                {isAuthorized ? (
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

            {isAuthorized && calendarId && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-900">
                  Calendar: "Barakah Tasks - Prayer Times & Tasks"
                </div>
                <div className="text-xs text-green-700">
                  ID: {calendarId.substring(0, 20)}...
                </div>
                {lastSync && (
                  <div className="text-xs text-green-600 mt-1">
                    Last synced: {lastSync.toLocaleString()}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Button 
                onClick={handleSync}
                disabled={isLoading}
                className="w-full"
                variant={isAuthorized ? "default" : "outline"}
              >
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    {isAuthorized ? "Syncing..." : "Connecting..."}
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    {isAuthorized ? "Sync Now" : "Connect Google Calendar"}
                  </>
                )}
              </Button>

              {isAuthorized && (
                <Button 
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Disconnect Google Calendar
                </Button>
              )}
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Real-time sync of prayer times and tasks</div>
              <div>• Automatic calendar creation and updates</div>
              <div>• Works with Google Calendar mobile apps</div>
              <div>• Secure OAuth 2.0 authentication</div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}