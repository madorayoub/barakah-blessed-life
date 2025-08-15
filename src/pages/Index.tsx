import { Star, Clock, Book, Target, Heart, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import PrayerTimes from "@/components/PrayerTimes"
import TaskManager from "@/components/TaskManager"
import IslamicCalendar from "@/components/IslamicCalendar"
import { IslamicCard, IslamicCardContent, IslamicCardHeader, IslamicCardTitle } from "@/components/ui/islamic-card"
import heroPattern from "@/assets/hero-pattern.jpg"

const Index = () => {
  const features = [
    {
      icon: Clock,
      title: "Prayer Times",
      description: "Accurate prayer times with beautiful Adhan notifications"
    },
    {
      icon: Compass,
      title: "Qibla Direction",
      description: "Find the direction to Mecca from anywhere in the world"
    },
    {
      icon: Book,
      title: "Quran Reader",
      description: "Read, listen, and reflect with translations and recitations"
    },
    {
      icon: Target,
      title: "Habit Tracking",
      description: "Track Islamic practices and spiritual growth"
    },
    {
      icon: Heart,
      title: "Dua Library",
      description: "Extensive collection of supplications for every occasion"
    },
    {
      icon: Star,
      title: "Productivity",
      description: "Seamlessly blend spiritual and worldly goals"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroPattern})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="pattern-geometric absolute inset-0 opacity-10" />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 gradient-primary bg-clip-text text-transparent animate-gentle-float">
              Barakah Tasks
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A blessed productivity app that harmonizes your spiritual practices 
              with daily tasks, guided by Islamic principles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary text-primary-foreground shadow-blessed hover:shadow-divine transition-all duration-300">
                Start Your Journey
              </Button>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  View Demo & Features
                </Button>
              </Link>
            </div>
            <div className="mt-8 text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Star className="h-4 w-4 text-accent" fill="currentColor" />
              <span>Join thousands finding barakah in productivity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Islamic Productivity Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to live a blessed and productive life, 
              all in one beautiful app
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <IslamicCard 
                key={index} 
                variant="default" 
                className="text-center hover:shadow-blessed transition-all duration-300 animate-gentle-float"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <IslamicCardHeader>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg gradient-primary flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <IslamicCardTitle className="text-xl">{feature.title}</IslamicCardTitle>
                </IslamicCardHeader>
                <IslamicCardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </IslamicCardContent>
              </IslamicCard>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Your Daily Spiritual Dashboard
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience a seamless blend of Islamic practices and modern productivity
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="lg:col-span-1">
              <PrayerTimes />
            </div>
            <div className="lg:col-span-1">
              <TaskManager />
            </div>
            <div className="lg:col-span-1">
              <IslamicCalendar />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 gradient-peaceful">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Begin Your Blessed Journey Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Download Barakah Tasks and discover how spiritual mindfulness 
              can transform your daily productivity
            </p>
            <Button size="lg" className="gradient-gold text-accent-foreground shadow-golden hover:shadow-divine transition-all duration-300 animate-blessing-glow">
              Download Now - Free
            </Button>
            <div className="mt-6 text-sm text-muted-foreground">
              Available on iOS and Android
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-card">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-5 w-5 text-accent" fill="currentColor" />
            <span className="font-display font-semibold text-lg">Barakah Tasks</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Developed with love and devotion for the Muslim community
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Index