import { ArrowLeft, Calendar, Download, Clock, Bell, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarExport } from '@/components/CalendarExport'
import CalendarMonth from '@/components/CalendarMonth'
import CalendarWeekView from '@/components/CalendarWeekView'
import CalendarDayView from '@/components/CalendarDayView'
import { GoogleCalendarConnect } from '@/components/GoogleCalendarConnect'
import { AppleCalendarExport } from '@/components/AppleCalendarExport'
import { CalDAVIntegration } from '@/components/CalDAVIntegration'
import { useNavigate } from 'react-router-dom'

const CalendarView = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-4 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold">Calendar</h1>
              <p className="text-muted-foreground">Your Islamic schedule and prayer times</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="week" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="sync">Sync</TabsTrigger>
          </TabsList>

          <TabsContent value="day" className="space-y-6">
            <CalendarDayView />
          </TabsContent>

          <TabsContent value="week" className="space-y-6">
            <CalendarWeekView />
          </TabsContent>

          <TabsContent value="month" className="space-y-6">
            <CalendarMonth />
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            {/* Sync Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Calendar Sync</h2>
                <p className="text-muted-foreground">
                  Connect your external calendars to sync prayer times and tasks automatically
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <GoogleCalendarConnect />
                <AppleCalendarExport />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-8">
            {/* Hero Section */}
            <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Never Miss a Prayer Again</CardTitle>
                <CardDescription className="text-base">
                  Export your prayer schedule to Google Calendar, Apple Calendar, Outlook, and more
                </CardDescription>
              </CardHeader>
            </Card>

          {/* Benefits */}
          <section>
            <h2 className="text-xl font-bold mb-6">Why Sync Your Calendar?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    Visual Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    See your prayer times alongside work meetings, appointments, and personal events in one unified view.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Smart Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Use your existing calendar's notification system to get prayer reminders exactly when you need them.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-amber-600" />
                    Islamic Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Includes major Islamic holidays, Ramadan dates, and special occasions automatically calculated for each year.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Download className="h-5 w-5 text-purple-600" />
                    Universal Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Export in standard .ics format that works with Google Calendar, Apple Calendar, Outlook, and more.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Calendar Integration Components */}
          <section>
            <h2 className="text-xl font-bold mb-6">Real-Time Calendar Integration</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GoogleCalendarConnect />
              <AppleCalendarExport />
            </div>
          </section>

          {/* Legacy Export */}
          <section>
            <h2 className="text-xl font-bold mb-6">Universal Calendar Export</h2>
            <CalendarExport />
          </section>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Import to Your Calendar</CardTitle>
              <CardDescription>
                Step-by-step instructions for popular calendar apps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">Google</Badge>
                  Google Calendar
                </h4>
                <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>1. Download the .ics file from above</li>
                  <li>2. Go to calendar.google.com</li>
                  <li>3. Click the + next to "Other calendars"</li>
                  <li>4. Select "Import" and choose your downloaded file</li>
                  <li>5. Your prayer times will appear in your calendar!</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="outline" className="bg-gray-50 text-gray-700">Apple</Badge>
                  Apple Calendar (Mac/iPhone)
                </h4>
                <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>1. Download the .ics file from above</li>
                  <li>2. Double-click the file (Mac) or tap it (iPhone)</li>
                  <li>3. Choose which calendar to import to</li>
                  <li>4. Click "Import" to add prayer times</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">Outlook</Badge>
                  Microsoft Outlook
                </h4>
                <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>1. Download the .ics file from above</li>
                  <li>2. Open Outlook and go to File → Open & Export</li>
                  <li>3. Select "Import/Export" then "Import an iCalendar (.ics) file"</li>
                  <li>4. Choose your downloaded file and import</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Important Note */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800">Important Note</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 text-sm">
                <strong>Regular Updates:</strong> When you change your location or prayer settings, 
                you'll need to export and import the calendar again to get updated prayer times. 
                We're working on automatic syncing for future versions.
              </p>
            </CardContent>
          </Card>

          </TabsContent>

          <TabsContent value="caldav" className="space-y-8">
            {/* CalDAV Integration Hero */}
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Universal Calendar Protocol</CardTitle>
                <CardDescription className="text-base">
                  Connect to ANY CalDAV-compatible calendar service: iCloud, Google, Outlook, and more
                </CardDescription>
              </CardHeader>
            </Card>

            {/* CalDAV Integration Component */}
            <CalDAVIntegration />

            {/* Technical Information */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900">Why CalDAV?</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium mb-2">✅ Universal Compatibility</div>
                    <div>Works with iCloud, Google, Outlook, and any CalDAV server</div>
                  </div>
                  <div>
                    <div className="font-medium mb-2">✅ Real-Time Sync</div>
                    <div>Two-way synchronization just like native integrations</div>
                  </div>
                  <div>
                    <div className="font-medium mb-2">✅ Cross-Platform</div>
                    <div>Sync across iPhone, iPad, Mac, PC, and web browsers</div>
                  </div>
                  <div>
                    <div className="font-medium mb-2">✅ Standard Protocol</div>
                    <div>Industry-standard CalDAV protocol used by major providers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default CalendarView