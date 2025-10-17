import { ArrowLeft, Search, Clock, Calendar, Settings, User, Bell, Download, BookOpen, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Help() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const faqSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: User,
      questions: [
        {
          q: 'How do I set up my prayer times?',
          a: 'Go to Settings > Prayer Time Settings. Enter your city and country, choose your calculation method (like ISNA or Muslim World League), and select your madhab (Shafi or Hanafi). The app will automatically calculate accurate prayer times for your location.'
        },
        {
          q: 'Why do I need to provide my location?',
          a: 'Prayer times vary based on your geographic location and the position of the sun. We use your location only to calculate accurate prayer times - we never track your movements or share your location data.'
        },
        {
          q: 'How do I change my difficulty mode?',
          a: 'In Settings > Profile Settings, you can switch between Basic Mode (5 daily prayers only) and Advanced Mode (includes Sunnah prayers, Quran reading, dhikr, and additional Islamic practices).'
        }
      ]
    },
    {
      id: 'prayer-times',
      title: 'Prayer Times & Tracking',
      icon: Clock,
      questions: [
        {
          q: 'Are the prayer times accurate?',
          a: 'Yes! We use the same calculation methods used by major Islamic organizations worldwide. You can choose from ISNA, Muslim World League, University of Karachi, and other trusted methods. You can also manually adjust times if needed.'
        },
        {
          q: 'Can I adjust prayer times manually?',
          a: 'Absolutely. In Settings > Prayer Time Settings, you can add or subtract up to 30 minutes from any prayer time to match your local mosque or personal preference.'
        },
        {
          q: 'How do I mark prayers as completed?',
          a: 'On the Dashboard, you\'ll see today\'s prayer times. Simply click the checkbox next to each prayer when you\'ve completed it. This helps track your consistency and build spiritual streaks.'
        },
        {
          q: 'What is the prayer streak feature?',
          a: 'Your prayer streak shows how many consecutive days you\'ve completed all 5 daily prayers. It\'s a motivational tool to help you maintain consistency in your spiritual practice.'
        }
      ]
    },
    {
      id: 'tasks-productivity',
      title: 'Tasks & Productivity',
      icon: BookOpen,
      questions: [
        {
          q: 'How do I create Islamic task templates?',
          a: 'Go to the Tasks page and click "Add Task". You\'ll find pre-built Islamic templates for activities like Quran reading, dhikr, charity reminders, and Islamic learning goals.'
        },
        {
          q: 'Can I set recurring Islamic tasks?',
          a: 'Yes! When creating a task, you can set it to repeat daily, weekly, or on a custom schedule. This is perfect for daily Quran reading, weekly charity, or monthly Islamic learning goals.'
        },
        {
          q: 'How does the spiritual progress tracking work?',
          a: 'The Analytics page shows your prayer completion rates, task progress, and spiritual goals over time. It helps you see patterns, maintain consistency, and stay motivated in your Islamic practices.'
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications & Reminders',
      icon: Bell,
      questions: [
        {
          q: 'How do I enable prayer notifications?',
          a: 'Go to Settings > Notification Settings and enable browser notifications. You can set how many minutes before each prayer you\'d like to be reminded (5-30 minutes).'
        },
        {
          q: 'I\'m not receiving notifications. What should I do?',
          a: 'Check that you\'ve allowed notifications in your browser settings. In Chrome, click the lock icon next to the URL and ensure notifications are "Allow". You can also check Settings > Notification Settings in the app.'
        },
        {
          q: 'Can I customize notification timing?',
          a: 'Yes! In Settings > Notification Settings, you can set different reminder times for each prayer, ranging from 5 to 30 minutes before the prayer time.'
        }
      ]
    },
    {
      id: 'calendar-export',
      title: 'Calendar Integration',
      icon: Calendar,
      questions: [
        {
          q: 'How do I sync prayer times with Google Calendar?',
          a: 'Go to Settings > Calendar Integration and click "Export to Google Calendar". This will download an .ics file that you can import into Google Calendar, Apple Calendar, or Outlook.'
        },
        {
          q: 'Will the calendar sync update automatically?',
          a: 'Currently, you\'ll need to re-export and import the calendar file when you change your location or prayer settings. We\'re working on automatic syncing for future updates.'
        },
        {
          q: 'Can I add Islamic holidays to my calendar?',
          a: 'Yes! The calendar export includes major Islamic holidays and events like Ramadan start/end dates, Eid celebrations, and the Islamic New Year.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: Settings,
      questions: [
        {
          q: 'The app keeps logging me out. What\'s wrong?',
          a: 'This might be a browser cache issue. Try clearing your browser cache and cookies for this site, then log in again. If the problem persists, make sure you\'re not browsing in incognito/private mode.'
        },
        {
          q: 'Prayer times seem incorrect for my location.',
          a: 'Double-check your city and country in Settings > Location Settings. If they\'re correct, try using a different calculation method. Some regions work better with specific methods (e.g., ISNA for North America, Muslim World League for most other areas).'
        },
        {
          q: 'How do I delete my account and data?',
          a: 'Go to Settings and scroll down to find the account deletion option. This will permanently delete all your data including prayer records, tasks, and preferences. This action cannot be undone.'
        },
        {
          q: 'The onboarding keeps appearing even though I completed it.',
          a: 'This is usually a browser storage issue. Clear your browser cache and cookies, then reload the app. If you\'re still having issues, try using a different browser temporarily.'
        }
      ]
    }
  ]

  const quickLinks = [
    { title: 'Settings', icon: Settings, action: () => navigate('/settings') },
    { title: 'About Barakah Tasks', icon: Heart, action: () => navigate('/about') },
    { title: 'Privacy Policy', icon: BookOpen, action: () => navigate('/privacy') },
    { title: 'Dashboard', icon: User, action: () => navigate('/dashboard') }
  ]

  const filteredSections = faqSections.map(section => ({
    ...section,
    questions: section.questions.filter(
      q => 
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.questions.length > 0 || searchTerm === '')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border dark:bg-muted">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Settings
            </Button>
            <div className="h-4 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold">Help & Support</h1>
              <p className="text-muted-foreground">Find answers and get the most out of Barakah Tasks</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Search Help Articles</CardTitle>
              <CardDescription>Find answers to your questions quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for help topics, features, or troubleshooting..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <section>
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={link.action}>
                  <CardContent className="p-4 text-center">
                    <link.icon className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                    <p className="text-sm font-medium">{link.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ Sections */}
          <section>
            <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {filteredSections.map((section) => (
                <Card key={section.id}>
                  <Collapsible 
                    open={openSections[section.id]} 
                    onOpenChange={() => toggleSection(section.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <section.icon className="h-5 w-5 text-emerald-600" />
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                          </div>
                          {openSections[section.id] ? 
                            <ChevronDown className="h-5 w-5" /> : 
                            <ChevronRight className="h-5 w-5" />
                          }
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-4">
                        {section.questions.map((faq, index) => (
                          <div key={index} className="border-l-2 border-emerald-200 pl-4">
                            <h4 className="font-semibold mb-2 text-emerald-900">{faq.q}</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                          </div>
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </section>

          {/* Still Need Help */}
          <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-emerald-600" />
                Still Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you can't find the answer you're looking for, we're here to help! 
                You can reach out to us through the feedback option in Settings.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate('/settings')}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Contact Support
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/about')}
                >
                  Learn More About Barakah Tasks
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}