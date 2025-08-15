import { Calendar, Moon } from "lucide-react"
import { IslamicCard, IslamicCardContent, IslamicCardHeader, IslamicCardTitle } from "@/components/ui/islamic-card"

const IslamicCalendar = () => {
  const today = new Date()
  const islamicDate = "15 Sha'ban 1445"
  
  const islamicEvents = [
    { date: "Tomorrow", event: "Night of Salvation (Laylat al-Bara'at)", special: true },
    { date: "In 3 days", event: "Community Iftar", special: false },
    { date: "Next Friday", event: "Jumu'ah Prayer", special: false },
  ]

  return (
    <IslamicCard variant="sacred" className="w-full max-w-md">
      <IslamicCardHeader className="pb-4">
        <IslamicCardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" />
          Islamic Calendar
        </IslamicCardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Moon className="h-3 w-3" />
          <span>{islamicDate}</span>
        </div>
      </IslamicCardHeader>
      <IslamicCardContent className="space-y-3">
        <div className="bg-card/50 p-4 rounded-lg border">
          <div className="text-center">
            <div className="text-2xl font-display font-bold text-primary">
              {today.getDate()}
            </div>
            <div className="text-sm text-muted-foreground">
              {today.toLocaleDateString('en-US', { 
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-display font-semibold text-sm text-foreground">
            Upcoming Events
          </h4>
          {islamicEvents.map((event, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-all ${
                event.special
                  ? "gradient-gold text-accent-foreground shadow-blessed"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-display font-medium text-sm">
                    {event.event}
                  </div>
                  <div className="text-xs opacity-80">
                    {event.date}
                  </div>
                </div>
                {event.special && (
                  <Moon className="h-4 w-4 animate-gentle-float" />
                )}
              </div>
            </div>
          ))}
        </div>
      </IslamicCardContent>
    </IslamicCard>
  )
}

export default IslamicCalendar