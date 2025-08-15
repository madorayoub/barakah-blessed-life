import { useState } from "react"
import { Settings, User, Clock, Book, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IslamicCard, IslamicCardContent, IslamicCardHeader, IslamicCardTitle } from "@/components/ui/islamic-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DifficultyModes = () => {
  const [selectedMode, setSelectedMode] = useState("standard")

  const modes = {
    easy: {
      name: "Easy Mode",
      description: "Perfect for beginners",
      icon: "🌱",
      features: [
        "5 Daily Prayers only",
        "Simple prayer reminders",
        "Basic progress tracking",
        "Gentle notifications"
      ],
      color: "bg-green-100 text-green-800 border-green-200"
    },
    standard: {
      name: "Standard Mode", 
      description: "Balanced spiritual practice",
      icon: "🌙",
      features: [
        "5 Daily Prayers",
        "Common Sunnah prayers",
        "Weekly Quran goals",
        "Dhikr reminders",
        "Islamic calendar events"
      ],
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    advanced: {
      name: "Advanced Mode",
      description: "Complete Islamic lifestyle",
      icon: "⭐",
      features: [
        "All prayers + Sunnah",
        "Daily Quran reading",
        "Comprehensive dhikr tracking",
        "Tahajjud reminders",
        "Islamic study goals",
        "Community challenges"
      ],
      color: "bg-purple-100 text-purple-800 border-purple-200"
    }
  }

  const currentMode = modes[selectedMode as keyof typeof modes]

  return (
    <div className="w-full max-w-2xl space-y-4">
      <IslamicCard variant="sacred">
        <IslamicCardHeader>
          <IslamicCardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-accent" />
            Choose Your Spiritual Journey
          </IslamicCardTitle>
          <p className="text-sm text-muted-foreground">
            Select the mode that matches your current practice level
          </p>
        </IslamicCardHeader>
        <IslamicCardContent>
          <Select value={selectedMode} onValueChange={setSelectedMode}>
            <SelectTrigger className="mb-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(modes).map(([key, mode]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <span>{mode.icon}</span>
                    <span>{mode.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </IslamicCardContent>
      </IslamicCard>

      {/* Mode Details */}
      <IslamicCard variant="default">
        <IslamicCardHeader>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${currentMode.color}`}>
            <span>{currentMode.icon}</span>
            <span>{currentMode.name}</span>
          </div>
          <IslamicCardTitle className="mt-2">{currentMode.description}</IslamicCardTitle>
        </IslamicCardHeader>
        <IslamicCardContent>
          <div className="space-y-3">
            <h4 className="font-medium text-sm">What's included:</h4>
            <div className="grid gap-2">
              {currentMode.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </IslamicCardContent>
      </IslamicCard>

      {/* Quick Stats Preview */}
      <div className="grid grid-cols-3 gap-4">
        <IslamicCard variant="default" className="text-center">
          <IslamicCardContent className="py-4">
            <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-lg font-display font-bold">
              {selectedMode === "easy" ? "5" : selectedMode === "standard" ? "8" : "12"}
            </div>
            <div className="text-xs text-muted-foreground">Daily Tasks</div>
          </IslamicCardContent>
        </IslamicCard>
        
        <IslamicCard variant="default" className="text-center">
          <IslamicCardContent className="py-4">
            <Book className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-lg font-display font-bold">
              {selectedMode === "easy" ? "0" : selectedMode === "standard" ? "3" : "7"}
            </div>
            <div className="text-xs text-muted-foreground">Study Goals</div>
          </IslamicCardContent>
        </IslamicCard>
        
        <IslamicCard variant="default" className="text-center">
          <IslamicCardContent className="py-4">
            <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-lg font-display font-bold">
              {selectedMode === "easy" ? "Basic" : selectedMode === "standard" ? "Detailed" : "Complete"}
            </div>
            <div className="text-xs text-muted-foreground">Tracking</div>
          </IslamicCardContent>
        </IslamicCard>
      </div>

      <Button className="w-full gradient-primary text-primary-foreground">
        Start {currentMode.name}
      </Button>
    </div>
  )
}

export default DifficultyModes