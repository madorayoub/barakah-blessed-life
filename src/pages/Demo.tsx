import AdvancedPrayerTimes from "@/components/AdvancedPrayerTimes"
import CalendarIntegration from "@/components/CalendarIntegration"
import DifficultyModes from "@/components/DifficultyModes"
import TaskManager from "@/components/TaskManager"
import { IslamicCard, IslamicCardContent, IslamicCardHeader, IslamicCardTitle } from "@/components/ui/islamic-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Palette, Calendar, Code, Settings } from "lucide-react"
import { Link } from "react-router-dom"

const Demo = () => {
  const designTokens = [
    { name: "Primary", color: "hsl(158, 45%, 25%)", description: "Deep emerald - Islamic green" },
    { name: "Accent", color: "hsl(45, 85%, 55%)", description: "Gold - Islamic calligraphy" },
    { name: "Background", color: "hsl(48, 20%, 98%)", description: "Peaceful cream" },
    { name: "Pattern Light", color: "hsl(158, 25%, 85%)", description: "Geometric pattern base" }
  ]

  const technicalFeatures = [
    "Adhan library for precise prayer calculations",
    "ICS calendar export for external sync",
    "Multiple calculation methods (MWL, Karachi, Egyptian)",
    "Arabic typography with RTL support",
    "Progressive difficulty modes",
    "Offline prayer time caching"
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold">Barakah Tasks Demo</h1>
              <p className="text-sm text-muted-foreground">Complete feature showcase & technical preview</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Design System Preview */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-display font-bold mb-2 flex items-center gap-2">
              <Palette className="h-6 w-6 text-accent" />
              Design System
            </h2>
            <p className="text-muted-foreground">Islamic-inspired colors, typography, and patterns</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {designTokens.map((token, index) => (
              <IslamicCard key={index} variant="default">
                <IslamicCardContent className="p-4">
                  <div 
                    className="w-full h-16 rounded-lg mb-3 border"
                    style={{ backgroundColor: token.color }}
                  />
                  <div className="text-sm font-display font-semibold">{token.name}</div>
                  <div className="text-xs text-muted-foreground">{token.description}</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">{token.color}</code>
                </IslamicCardContent>
              </IslamicCard>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <IslamicCard variant="prayer" className="text-center">
              <IslamicCardContent className="py-6">
                <div className="text-lg font-display">Prayer Variant</div>
                <div className="text-sm text-muted-foreground">Gentle pulse animation</div>
              </IslamicCardContent>
            </IslamicCard>
            <IslamicCard variant="blessed" className="text-center">
              <IslamicCardContent className="py-6">
                <div className="text-lg font-display">Blessed Variant</div>
                <div className="text-sm opacity-90">Primary gradient background</div>
              </IslamicCardContent>
            </IslamicCard>
            <IslamicCard variant="sacred" className="text-center">
              <IslamicCardContent className="py-6">
                <div className="text-lg font-display">Sacred Variant</div>
                <div className="text-sm text-muted-foreground">Geometric patterns</div>
              </IslamicCardContent>
            </IslamicCard>
          </div>
        </section>

        {/* Calendar Integration Showcase */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-display font-bold mb-2 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-accent" />
              Calendar Integration
            </h2>
            <p className="text-muted-foreground">
              Seamless sync with Google Calendar, Apple Calendar, and Outlook via ICS feeds
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <CalendarIntegration />
            <div className="space-y-4">
              <IslamicCard variant="default">
                <IslamicCardHeader>
                  <IslamicCardTitle>How It Works</IslamicCardTitle>
                </IslamicCardHeader>
                <IslamicCardContent className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</div>
                    <div>
                      <div className="font-medium text-sm">Generate Personal Feed</div>
                      <div className="text-xs text-muted-foreground">Get your unique ICS subscription URL</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</div>
                    <div>
                      <div className="font-medium text-sm">Subscribe in Any Calendar</div>
                      <div className="text-xs text-muted-foreground">Add the URL to Google, Apple, or Outlook</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">3</div>
                    <div>
                      <div className="font-medium text-sm">Auto-Sync Spiritual Schedule</div>
                      <div className="text-xs text-muted-foreground">Prayer times appear next to work meetings</div>
                    </div>
                  </div>
                </IslamicCardContent>
              </IslamicCard>
            </div>
          </div>
        </section>

        {/* Advanced Prayer Times */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-display font-bold mb-2">Advanced Prayer Times</h2>
            <p className="text-muted-foreground">
              Precise calculations with multiple methods, Arabic text, and smart scheduling
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <AdvancedPrayerTimes />
            <div className="space-y-4">
              <IslamicCard variant="default">
                <IslamicCardHeader>
                  <IslamicCardTitle>Technical Features</IslamicCardTitle>
                </IslamicCardHeader>
                <IslamicCardContent>
                  <div className="space-y-2">
                    {technicalFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </IslamicCardContent>
              </IslamicCard>
            </div>
          </div>
        </section>

        {/* Difficulty Modes */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-display font-bold mb-2 flex items-center gap-2">
              <Settings className="h-6 w-6 text-accent" />
              Progressive Difficulty Modes
            </h2>
            <p className="text-muted-foreground">
              Grow your practice from basic prayers to comprehensive Islamic lifestyle tracking
            </p>
          </div>
          
          <div className="flex justify-center">
            <DifficultyModes />
          </div>
        </section>

        {/* Enhanced Task Management */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-display font-bold mb-2">Task Management</h2>
            <p className="text-muted-foreground">
              Blend spiritual and worldly goals with Islamic context awareness
            </p>
          </div>
          
          <div className="flex justify-center">
            <TaskManager />
          </div>
        </section>

        {/* Technical Architecture */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-display font-bold mb-2 flex items-center gap-2">
              <Code className="h-6 w-6 text-accent" />
              Technical Architecture
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IslamicCard variant="default">
              <IslamicCardHeader>
                <IslamicCardTitle>Prayer Calculations</IslamicCardTitle>
              </IslamicCardHeader>
              <IslamicCardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Library:</strong> Adhan (precise Islamic calculations)</div>
                  <div><strong>Methods:</strong> MWL, Karachi, Egyptian, Dubai</div>
                  <div><strong>Accuracy:</strong> Location-based with manual adjustments</div>
                  <div><strong>Offline:</strong> Cached calculations for reliability</div>
                </div>
              </IslamicCardContent>
            </IslamicCard>

            <IslamicCard variant="default">
              <IslamicCardHeader>
                <IslamicCardTitle>Calendar Integration</IslamicCardTitle>
              </IslamicCardHeader>
              <IslamicCardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Format:</strong> ICS (iCalendar standard)</div>
                  <div><strong>Sync:</strong> Real-time subscription feeds</div>
                  <div><strong>Platforms:</strong> Google, Apple, Outlook, Exchange</div>
                  <div><strong>Future:</strong> OAuth2 for bidirectional sync</div>
                </div>
              </IslamicCardContent>
            </IslamicCard>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-8">
          <IslamicCard variant="blessed" className="max-w-2xl mx-auto">
            <IslamicCardContent className="py-8">
              <h3 className="text-2xl font-display font-bold mb-4">
                Ready to Build the MVP?
              </h3>
              <p className="mb-6 opacity-90">
                This demonstrates our key differentiator: seamless spiritual-secular integration 
                through external calendar sync, powered by precise Islamic calculations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Back to Landing
                  </Button>
                </Link>
                <Button className="bg-card text-primary hover:bg-card/90">
                  Start Development
                </Button>
              </div>
            </IslamicCardContent>
          </IslamicCard>
        </section>

      </div>
    </div>
  )
}

export default Demo