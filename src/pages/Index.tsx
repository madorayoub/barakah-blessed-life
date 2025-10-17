import { Star, Clock, Book, Target, Heart, Compass, Calendar, TrendingUp, Play, ArrowRight, Check, Users, BookOpen, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

const Index = () => {
  const features = [
    {
      icon: Clock,
      title: "Smart Prayer Integration",
      description: "Never miss a prayer with accurate times that sync seamlessly with your existing calendar apps"
    },
    {
      icon: BookOpen,
      title: "Islamic Task Management",
      description: "Organize daily tasks alongside spiritual goals like Quran reading, dhikr, and Islamic studies"
    },
    {
      icon: Calendar,
      title: "Unified Life Calendar",
      description: "See your prayers, work meetings, and spiritual practices in one beautifully organized view"
    },
    {
      icon: TrendingUp,
      title: "Spiritual Growth Tracking",
      description: "Monitor your Islamic practices and build consistent habits with detailed progress insights"
    }
  ]

  const benefits = [
    "Automated prayer time calculations for any location",
    "Seamless Google Calendar & Apple Calendar integration", 
    "Islamic holiday and important date tracking",
    "Customizable spiritual goal setting and tracking",
    "Beautiful, distraction-free interface designed for focus",
    "Offline support for prayers and Quran reading"
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-sm dark:bg-muted/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">ب</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Barakah Life</h1>
                <p className="text-sm font-medium text-primary">Islamic Productivity</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                to="/demo"
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Demo
              </Link>
              <Link
                to="/pricing"
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </Link>
              <Link to="/auth/login">
                <Button variant="ghost" className="font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-6 border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            ✨ Transform Your Spiritual Productivity
          </Badge>

          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
            Integrate Your
            <span className="text-primary"> Islamic Life</span>
            <br />
            With Modern Productivity
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Barakah Life seamlessly blends your prayers, spiritual goals, and daily tasks into one beautifully organized system.
            Stay connected to your faith while achieving your worldly goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-xl">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border border-primary/40 px-8 py-6 text-lg font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Privacy-first design
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Works offline
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Trusted by Muslims worldwide
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card px-6 py-20 dark:bg-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">
              Everything You Need for Islamic Productivity
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Thoughtfully designed features that respect your faith while boosting your productivity
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border border-border bg-card shadow-lg transition-shadow hover:shadow-xl dark:bg-muted">
                <CardHeader className="pb-4 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted px-6 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">
              Why Choose Barakah Life?
            </h2>
            <p className="text-xl text-muted-foreground">
              Built specifically for Muslims who want to excel in both dunya and akhirah
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-4">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <p className="font-medium text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-card px-6 py-20 text-foreground dark:bg-muted">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Start Your Islamic Productivity Journey Today
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            Join thousands of Muslims who have transformed their daily routine with Barakah Life.
            It's free to start, and your spiritual data stays private.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border border-primary/40 px-8 py-6 text-lg font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                Explore Features
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth." - Quran 6:73
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-12 dark:bg-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 flex items-center gap-3 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-white font-bold">ب</span>
              </div>
              <div>
                <h3 className="font-bold text-foreground">Barakah Life</h3>
                <p className="text-sm text-muted-foreground">Islamic Productivity</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="transition-colors hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/about" className="transition-colors hover:text-foreground">
                About
              </Link>
              <Link to="/help" className="transition-colors hover:text-foreground">
                Support
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Barakah Life. Built with love for the Muslim community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index
