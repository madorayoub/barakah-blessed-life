import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Heart, Users, Globe, TrendingUp } from 'lucide-react'

export default function Pricing() {
  const [impactStats] = useState({
    mealsProvided: 12847,
    childrenEducated: 234,
    cleanWaterDays: 1560,
    totalSubscribers: 847
  })

  const features = [
    "Unlimited Islamic tasks with built-in templates",
    "Complete Quran access (114 surahs)",
    "Accurate prayer times & notifications",
    "Advanced calendar with Islamic events",
    "Analytics & progress tracking",
    "Priority support from our team",
    "Offline access & data sync",
    "Apple & Google Calendar integration"
  ]

  const impactAreas = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Hunger Relief",
      description: "Providing nutritious meals to families in need",
      stat: `${impactStats.mealsProvided.toLocaleString()} meals provided`
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Education",
      description: "Supporting Islamic education for children",
      stat: `${impactStats.childrenEducated} children supported`
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Clean Water",
      description: "Bringing clean water to communities",
      stat: `${impactStats.cleanWaterDays.toLocaleString()} days of clean water`
    }
  ]

  const testimonials = [
    {
      name: "Aisha M.",
      location: "London, UK",
      text: "Not only has Barakah Life organized my daily worship and tasks, but knowing I'm helping others through my subscription makes it even more meaningful.",
      feature: "Social Impact"
    },
    {
      name: "Omar K.",
      location: "Toronto, CA",
      text: "The Islamic task templates and prayer integration have completely transformed my productivity. It's built specifically for Muslims by Muslims.",
      feature: "Islamic Features"
    },
    {
      name: "Fatima A.",
      location: "Sydney, AU",
      text: "The transparency reports showing exactly where the charity money goes builds so much trust. This is how all Muslim tech should operate.",
      feature: "Transparency"
    }
  ]

  const faqs = [
    {
      question: "How much of my subscription goes to charity?",
      answer: "$5 from every $19 monthly subscription goes directly to verified Islamic charities. We provide detailed monthly reports showing exactly where your money helped."
    },
    {
      question: "Which charities do you support?",
      answer: "We partner with established Islamic relief organizations focusing on hunger relief, education, and clean water projects. Current partners include Islamic Relief and local masjid initiatives."
    },
    {
      question: "Can I track the impact of my contribution?",
      answer: "Yes! You'll receive monthly impact reports showing the collective good done by all Barakah Life subscribers, plus access to our real-time impact dashboard."
    },
    {
      question: "Is there a free version available?",
      answer: "We offer a 14-day free trial so you can experience all features. Our single premium tier ensures we can maintain high quality while maximizing charitable impact."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can cancel your subscription at any time with no penalties. Your access continues until the end of your current billing period."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 dark:bg-muted">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-lg">ب</span>
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Barakah Life</h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/demo" className="text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </Link>
              <Link to="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-card dark:bg-muted">
        <div className="container mx-auto px-6 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border border-primary/30">
            Premium Islamic Productivity + Social Impact
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Organize Your Life,<br />
            <span className="text-primary">Transform the World</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Join the movement combining Islamic productivity with social good. 
            Every subscription helps provide meals, education, and clean water to those in need.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="bg-card rounded-full px-6 py-3 shadow-sm border border-border dark:bg-muted">
              <div className="flex items-center gap-3 text-primary">
                <Heart className="h-5 w-5" />
                <span className="font-semibold">${impactStats.totalSubscribers * 5} donated this month</span>
              </div>
            </div>
            <div className="bg-card rounded-full px-6 py-3 shadow-sm border border-border dark:bg-muted">
              <div className="flex items-center gap-3 text-primary">
                <Users className="h-5 w-5" />
                <span className="font-semibold">{impactStats.totalSubscribers} Muslims making impact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-lg mx-auto">
            <Card className="border-2 border-primary/40 shadow-xl bg-card dark:bg-muted">
              <CardHeader className="text-center pb-6">
                <Badge className="self-center mb-4 bg-primary text-primary-foreground">Most Popular</Badge>
                <CardTitle className="text-3xl font-bold">Barakah Life Premium</CardTitle>
                <CardDescription className="text-lg">
                  Complete Islamic productivity + social impact
                </CardDescription>

                <div className="mt-6">
                  <div className="text-5xl font-bold text-foreground">$19</div>
                  <div className="text-muted-foreground">per month</div>
                  <div className="mt-2 text-sm bg-primary/10 text-primary rounded-full px-3 py-1 inline-block">
                    $5 goes to Islamic charity
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t">
                  <Link to="/auth/signup" className="block">
                    <Button className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                      Start Making Impact Today
                    </Button>
                  </Link>
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    14-day free trial • Cancel anytime
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Your Subscription Creates Real Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every month, Barakah Life subscribers collectively contribute to meaningful causes. 
              Here's the impact we've made together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {impactAreas.map((area, index) => (
              <Card key={index} className="bg-card shadow-lg border border-border dark:bg-muted">
                <CardContent className="p-8 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    {area.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{area.title}</h3>
                  <p className="text-muted-foreground mb-4">{area.description}</p>
                  <div className="text-2xl font-bold text-primary">{area.stat}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Card className="bg-primary text-primary-foreground max-w-2xl mx-auto">
              <CardContent className="p-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Growing Impact Every Month</h3>
                <p className="text-primary-foreground/80 mb-4">
                  As our community grows, so does our collective ability to create positive change in the world.
                </p>
                <div className="text-3xl font-bold">${(impactStats.totalSubscribers * 5).toLocaleString()}</div>
                <div className="text-primary-foreground/80">donated this month alone</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-muted-foreground">
              Real feedback from Muslims using Barakah Life worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card shadow-lg border border-border dark:bg-muted">
                <CardContent className="p-8">
                  <Badge className="mb-4 bg-primary/10 text-primary border border-primary/30">
                    {testimonial.feature}
                  </Badge>
                  <blockquote className="text-foreground mb-6 italic">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-muted-foreground">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about Barakah Life
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card shadow-sm border border-border dark:bg-muted">
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Ready to Join the Movement?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Start your Islamic productivity journey while making a real difference in the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup">
              <Button size="lg" className="bg-card text-primary hover:bg-muted h-12 px-8 text-lg font-semibold">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="border border-primary-foreground/60 text-primary-foreground hover:bg-card hover:text-primary h-12 px-8">
                Explore Features
              </Button>
            </Link>
          </div>

          <p className="text-primary-foreground/80 mt-6">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 dark:bg-muted">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ب</span>
              </div>
              <span className="font-bold text-foreground text-lg">Barakah Life</span>
            </div>
            
            <div className="flex items-center gap-6 text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link to="/help" className="hover:text-foreground transition-colors">Support</Link>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Barakah Life. Building blessed productivity for the Ummah.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}