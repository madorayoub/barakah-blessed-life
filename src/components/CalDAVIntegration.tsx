import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Settings,
  Info,
  ExternalLink
} from 'lucide-react'
import { useCalDAV } from '@/hooks/useCalDAV'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export function CalDAVIntegration() {
  const [selectedProvider, setSelectedProvider] = useState('')
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    calendarName: 'Barakah Tasks'
  })
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  
  const {
    connections,
    isConnecting,
    connectCalDAV,
    syncEventsToCalDAV,
    disconnectCalDAV,
    providers
  } = useCalDAV()

  const handleConnect = async () => {
    if (!selectedProvider || !credentials.username || !credentials.password) {
      return
    }

    await connectCalDAV({
      provider: selectedProvider,
      username: credentials.username,
      password: credentials.password,
      calendarName: credentials.calendarName
    })
  }

  const handleSync = async (providerId: string) => {
    await syncEventsToCalDAV(providerId)
  }

  const getConnectionStatus = (providerId: string) => {
    const connection = connections[providerId]
    if (!connection) return 'disconnected'
    if (connection.connected) return 'connected'
    return 'error'
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          CalDAV Integration
        </CardTitle>
        <CardDescription>
          Connect to any CalDAV-compatible calendar service (iCloud, Google, Outlook, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connections" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="setup">Add Connection</TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="space-y-4">
            {/* Existing Connections */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Active Connections</h3>
              
              {Object.keys(providers).map(providerId => {
                const provider = providers[providerId as keyof typeof providers]
                const connection = connections[providerId]
                const status = getConnectionStatus(providerId)
                
                return (
                  <div key={providerId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{provider.icon}</span>
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        {connection && (
                          <div className="text-sm text-muted-foreground">
                            {connection.username} • {connection.calendarName}
                          </div>
                        )}
                        {connection?.lastSync && (
                          <div className="text-xs text-muted-foreground">
                            Last sync: {new Date(connection.lastSync).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={status === 'connected' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}>
                        {status === 'connected' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {status === 'error' && <XCircle className="h-3 w-3 mr-1" />}
                        {status === 'disconnected' && <XCircle className="h-3 w-3 mr-1" />}
                        {status === 'connected' ? 'Connected' : status === 'error' ? 'Error' : 'Not Connected'}
                      </Badge>
                      
                      {status === 'connected' && (
                        <Button
                          size="sm"
                          onClick={() => handleSync(providerId)}
                          disabled={isConnecting}
                        >
                          {isConnecting ? (
                            <Clock className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      
                      {status === 'connected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => disconnectCalDAV(providerId)}
                        >
                          Disconnect
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
              
              {Object.keys(connections).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No CalDAV connections configured. Add a connection to get started.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            {/* Important CORS Warning */}
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Technical Limitation:</strong> CalDAV from web browsers faces CORS restrictions. 
                This demo shows the interface and workflow, but production would require a backend proxy service.
              </AlertDescription>
            </Alert>

            {/* Provider Selection */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="provider">Calendar Provider</Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your calendar provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(providers).map(([id, provider]) => (
                      <SelectItem key={id} value={id}>
                        <div className="flex items-center gap-2">
                          <span>{provider.icon}</span>
                          <span>{provider.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Credentials */}
              {selectedProvider && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">
                      {selectedProvider === 'icloud' ? 'Apple ID Email' : 'Username/Email'}
                    </Label>
                    <Input
                      id="username"
                      type="email"
                      value={credentials.username}
                      onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                      placeholder={selectedProvider === 'icloud' ? 'your.email@icloud.com' : 'your.email@example.com'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">
                      {selectedProvider === 'icloud' ? 'App-Specific Password' : 'Password'}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                    />
                    {selectedProvider === 'icloud' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Generate an app-specific password in your Apple ID settings
                        <Button variant="link" className="p-0 h-auto text-xs ml-1" asChild>
                          <a href="https://appleid.apple.com/account/manage" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Apple ID Settings
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Advanced Settings */}
                  <Collapsible open={showAdvancedSettings} onOpenChange={setShowAdvancedSettings}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2" size="sm">
                        <Settings className="h-4 w-4" />
                        Advanced Settings
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="calendarName">Calendar Name</Label>
                        <Input
                          id="calendarName"
                          value={credentials.calendarName}
                          onChange={(e) => setCredentials(prev => ({ ...prev, calendarName: e.target.value }))}
                          placeholder="Barakah Tasks"
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Connect Button */}
                  <Button 
                    onClick={handleConnect}
                    disabled={isConnecting || !credentials.username || !credentials.password}
                    className="w-full"
                  >
                    {isConnecting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Connecting to CalDAV...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Connect to {providers[selectedProvider as keyof typeof providers]?.name}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Help Section */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">CalDAV Setup Instructions:</div>
                  <div className="text-sm space-y-1">
                    <div>• <strong>iCloud:</strong> Use your Apple ID email and create an app-specific password</div>
                    <div>• <strong>Google:</strong> Enable CalDAV access in Google Calendar settings</div>
                    <div>• <strong>Outlook:</strong> Use your Microsoft 365 account credentials</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    CalDAV provides real-time two-way sync with your calendar applications across all devices.
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
