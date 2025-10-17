import { PrayerTimesFixed } from '@/components/PrayerTimesFixed'
import { AppHeader } from '@/components/AppHeader'

const Prayers = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Prayer Times"
        subtitle="Your daily prayer schedule and tracking"
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <PrayerTimesFixed />
      </main>
    </div>
  )
}

export default Prayers
