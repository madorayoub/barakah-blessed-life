import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, Check, AlertCircle, Loader2, ChevronDown, Star, Clock, Calendar, Settings, User, Moon, Bookmark, Play, Pause } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

const AppInfo = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [switchValue, setSwitchValue] = useState(false)

  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-foreground">App Information</h1>
            <div className="w-32" /> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 space-y-16">
        
        {/* Introduction */}
        <section className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Barakah Tasks</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            An Islamic productivity app that helps Muslims integrate spiritual practices with daily life. 
            Track your prayers, manage tasks with Islamic principles, and maintain spiritual consistency.
          </p>
        </section>

        {/* App Information Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Version Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">App Version:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">August 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform:</span>
                <span className="font-medium">Web Application</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Core Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Accurate prayer times calculation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Islamic task management
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Calendar integration
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Spiritual analytics
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Prayer notifications
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Technical Credits */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Technical Credits</h3>
            <p className="text-muted-foreground mb-6">
              Barakah Tasks is built with modern web technologies and relies on Islamic calculation libraries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prayer Time Calculations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Library:</span>
                  <Badge variant="outline">Adhan.js v4.4.3</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Method:</span>
                  <span className="text-sm">High-precision calculations</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Standards:</span>
                  <span className="text-sm">ISNA, MWL, Karachi, Egypt</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Frontend:</span>
                  <Badge variant="outline">React + TypeScript</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Styling:</span>
                  <Badge variant="outline">Tailwind CSS</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Backend:</span>
                  <Badge variant="outline">Supabase</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">UI Components:</span>
                  <Badge variant="outline">shadcn/ui</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Privacy & Data */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Privacy & Data Handling</h3>
          </div>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Your Data Privacy</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 space-y-2">
              <p>• Your location is only used for prayer time calculations</p>
              <p>• Prayer completion data stays on your device and our secure servers</p>
              <p>• No personal data is shared with third parties</p>
              <p>• You can export or delete your data at any time</p>
              <p>• All data transmission is encrypted using HTTPS</p>
            </CardContent>
          </Card>
        </section>

        {/* Color Palette */}
        <section className="space-y-8">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-4">Color Palette</h3>
            <p className="text-muted-foreground mb-8">Inspired by Islamic tradition with emerald greens representing growth and gold accents symbolizing divine light.</p>
          </div>

          {/* Primary Colors */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-foreground">Primary Brand Colors</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <ColorSwatch name="Emerald 50" hex="#ecfdf5" />
              <ColorSwatch name="Emerald 100" hex="#d1fae5" />
              <ColorSwatch name="Emerald 600" hex="#059669" />
              <ColorSwatch name="Emerald 700" hex="#047857" />
              <ColorSwatch name="Emerald 900" hex="#064e3b" />
            </div>
          </div>

          {/* Gold Accent */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-foreground">Gold Accent (Use Sparingly)</h4>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <ColorSwatch name="Amber 500" hex="#f59e0b" />
              <ColorSwatch name="Amber 600" hex="#d97706" />
            </div>
          </div>

          {/* Neutral Scale */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-foreground">Neutral Scale</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <ColorSwatch name="Gray 50" hex="#f9fafb" />
              <ColorSwatch name="Gray 100" hex="#f3f4f6" />
              <ColorSwatch name="Gray 600" hex="#4b5563" />
              <ColorSwatch name="Gray 800" hex="#1f2937" />
              <ColorSwatch name="Gray 900" hex="#111827" />
            </div>
          </div>

          {/* Status Colors */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-foreground">Status Colors</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ColorSwatch name="Success" hex="#10b981" />
              <ColorSwatch name="Error" hex="#ef4444" />
              <ColorSwatch name="Warning" hex="#f59e0b" />
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-8">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-4">Typography</h3>
            <p className="text-muted-foreground mb-8">Supporting both Latin and Arabic characters with proper line spacing and contrast.</p>
          </div>

          <div className="space-y-6">
            <TypographyExample size="text-4xl" label="Display (36px)" text="Barakah Tasks Display" arabicText="مهام البركة" />
            <TypographyExample size="text-3xl" label="H1 (30px)" text="Main Heading" arabicText="العنوان الرئيسي" />
            <TypographyExample size="text-2xl" label="H2 (24px)" text="Section Heading" arabicText="عنوان القسم" />
            <TypographyExample size="text-xl" label="H3 (20px)" text="Subsection Heading" arabicText="عنوان فرعي" />
            <TypographyExample size="text-lg" label="Large Body (18px)" text="Large body text for emphasis" arabicText="نص كبير للتأكيد" />
            <TypographyExample size="text-base" label="Body (16px)" text="Regular body text for content" arabicText="النص العادي للمحتوى" />
            <TypographyExample size="text-sm" label="Small (14px)" text="Small text for captions" arabicText="نص صغير للتوضيحات" />
          </div>
        </section>

        {/* Button System */}
        <section className="space-y-8">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-4">Button System</h3>
            <p className="text-muted-foreground mb-8">Complete button variants with all interaction states.</p>
          </div>

          {/* Button Variants */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-foreground mb-4">Variants</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="destructive">Destructive Button</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div>
              <h4 className="text-xl font-semibold text-foreground mb-4">Sizes</h4>
              <div className="flex items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* Button States */}
            <div>
              <h4 className="text-xl font-semibold text-foreground mb-4">States</h4>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
                <Button onClick={simulateLoading} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Loading Example"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Form Components */}
        <section className="space-y-8">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-4">Form Components</h3>
            <p className="text-muted-foreground mb-8">Accessible form inputs with proper validation states.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Inputs */}
            <Card>
              <CardHeader>
                <CardTitle>Text Inputs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="error-input">Input with Error</Label>
                  <Input id="error-input" className="border-red-500 focus:ring-red-500" />
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    This field is required
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="success-input">Input with Success</Label>
                  <Input id="success-input" className="border-green-500 focus:ring-green-500" />
                  <p className="text-sm text-green-500 flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Looks good!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Elements */}
            <Card>
              <CardHeader>
                <CardTitle>Interactive Elements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="select">Select Dropdown</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose prayer method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mwl">Muslim World League</SelectItem>
                      <SelectItem value="isna">ISNA</SelectItem>
                      <SelectItem value="egypt">Egyptian General Authority</SelectItem>
                      <SelectItem value="karachi">University of Karachi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Checkboxes</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fajr" />
                    <label htmlFor="fajr" className="text-sm font-medium">Fajr notifications</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dhuhr" defaultChecked />
                    <label htmlFor="dhuhr" className="text-sm font-medium">Dhuhr notifications</label>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Switch Controls</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={switchValue} 
                      onCheckedChange={setSwitchValue}
                    />
                    <label className="text-sm font-medium">Enable Adhan sound</label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Card System */}
        <section className="space-y-8">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-4">Card System</h3>
            <p className="text-muted-foreground mb-8">Flexible card components for different content types.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prayer Time Card */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 opacity-50" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    <CardTitle className="text-emerald-900">Fajr</CardTitle>
                  </div>
                  <Badge variant="secondary">Next</Badge>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-emerald-900 mb-1">5:42 AM</div>
                <p className="text-sm text-emerald-700">in 3 hours 15 minutes</p>
              </CardContent>
            </Card>

            {/* Task Progress Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <CardTitle>Today's Progress</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Prayer Goals</span>
                    <span>4/5</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Dhikr Count</span>
                    <span>87/100</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Calendar Integration Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle>Calendar Sync</CardTitle>
                </div>
                <CardDescription>
                  Prayer times in your calendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Google Calendar</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <div className="h-2 w-2 rounded-full bg-green-600 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Apple Calendar</span>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Islamic-Specific Elements */}
        <section className="space-y-8">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-4">Islamic-Specific Elements</h3>
            <p className="text-muted-foreground mb-8">Components designed with Islamic principles and cultural sensitivity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Prayer Time Display */}
            <Card className="bg-card dark:bg-muted">
              <CardHeader>
                <CardTitle className="text-center text-foreground">Prayer Times Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Fajr", time: "5:42 AM", next: true },
                    { name: "Dhuhr", time: "12:34 PM", next: false },
                    { name: "Asr", time: "3:47 PM", next: false },
                    { name: "Maghrib", time: "6:23 PM", next: false },
                    { name: "Isha", time: "8:15 PM", next: false }
                  ].map((prayer) => (
                    <div key={prayer.name} className={`flex items-center justify-between p-3 rounded-lg ${prayer.next ? 'bg-primary/20' : 'bg-card/60 dark:bg-muted/60'}`}>
                      <span className={`font-medium ${prayer.next ? 'text-primary' : 'text-muted-foreground'}`}>
                        {prayer.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${prayer.next ? 'text-primary' : 'text-muted-foreground'}`}>
                          {prayer.time}
                        </span>
                        {prayer.next && <Badge variant="secondary">Next</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Spiritual Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Moon className="h-5 w-5 text-primary" />
                  <span>Spiritual Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="87, 100"
                        className="text-emerald-600"
                      />
                      <path
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="0, 100"
                        className="text-emerald-100"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-emerald-900">
                      87%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Today's completion</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dhikr Count</span>
                    <span className="text-sm font-medium">87/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quran Reading</span>
                    <span className="text-sm font-medium">15/20 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Prayers Completed</span>
                    <span className="text-sm font-medium">4/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Navigation Elements */}
        <section className="space-y-8">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-4">Navigation Elements</h3>
            <p className="text-muted-foreground mb-8">Mobile-first navigation components with proper states.</p>
          </div>

          {/* Bottom Tab Navigation (Mobile) */}
          <Card>
            <CardHeader>
              <CardTitle>Bottom Tab Navigation (Mobile)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around items-center py-2 bg-card border rounded-lg">
                {[
                  { icon: Calendar, label: "Dashboard", active: true },
                  { icon: Bookmark, label: "Tasks", active: false },
                  { icon: Clock, label: "Prayers", active: false },
                  { icon: Calendar, label: "Calendar", active: false },
                  { icon: Settings, label: "Settings", active: false }
                ].map((item, index) => (
                  <div key={index} className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md ${item.active ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}>
                    <item.icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Accessibility */}
        <section className="space-y-8">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-4">Accessibility Standards</h3>
            <p className="text-muted-foreground mb-8">WCAG AA compliant design with proper contrast ratios and keyboard navigation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Contrast Ratios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Primary on White</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">AA</Badge>
                  </div>
                  <div className="p-3 bg-card border rounded text-primary dark:bg-muted">
                    Sample text with primary color
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Body Text</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">AAA</Badge>
                  </div>
                  <div className="p-3 bg-card border rounded text-foreground dark:bg-muted">
                    Regular body text with sufficient contrast
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Touch Targets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">All interactive elements meet the minimum 44px touch target size requirement.</p>
                
                <div className="space-y-3">
                  <Button className="w-full" size="default">
                    Primary Button (44px min height)
                  </Button>
                  <Button variant="outline" className="w-full" size="default">
                    Secondary Button (44px min height)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Implementation Notes */}
        <section className="space-y-8">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-4">Implementation Notes</h3>
            <p className="text-muted-foreground mb-8">Technical guidelines for using this design system.</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3">CSS Custom Properties</h4>
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
{`/* Primary Colors */
--emerald-600: 158 64% 52%;
--amber-500: 38 92% 50%;

/* Typography Scale */
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;

/* Spacing (8px grid) */
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;`}
                  </pre>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Component Usage</h4>
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
{`<Button variant="default">
  Primary Action
</Button>

<Button variant="secondary">
  Secondary Action
</Button>

<Card className="shadow-blessed">
  <CardHeader>
    <CardTitle>Prayer Times</CardTitle>
  </CardHeader>
</Card>`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </main>
    </div>
  )
}

// Helper Components
const ColorSwatch = ({ name, hex }: { name: string; hex: string }) => (
  <div className="text-center">
    <div className="w-full h-20 rounded-lg border border-border shadow-sm mb-2" style={{ backgroundColor: hex }} />
    <div className="text-sm font-medium text-foreground">{name}</div>
    <div className="text-xs text-muted-foreground">{hex}</div>
  </div>
)

const TypographyExample = ({ size, label, text, arabicText }: { 
  size: string; 
  label: string; 
  text: string; 
  arabicText: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">Line height: 1.5x</span>
    </div>
    <div className={`${size} text-foreground`}>{text}</div>
    <div className={`${size} text-foreground`} dir="rtl">{arabicText}</div>
  </div>
)

export default AppInfo