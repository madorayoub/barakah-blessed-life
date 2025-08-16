import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, BookOpen, Search, Bookmark, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'

// Sample Quranic verses with Arabic and English
const sampleVerses = [
  {
    id: 1,
    surah: "Al-Fatiha",
    surahNumber: 1,
    verse: 1,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    transliteration: "Bismillahi r-rahmani r-rahim",
    english: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
  },
  {
    id: 2,
    surah: "Al-Fatiha", 
    surahNumber: 1,
    verse: 2,
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Alhamdu lillahi rabbi l-'alamin",
    english: "All praise is due to Allah, Lord of the worlds."
  },
  {
    id: 3,
    surah: "Al-Fatiha",
    surahNumber: 1, 
    verse: 3,
    arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
    transliteration: "Ar-rahmani r-rahim",
    english: "The Entirely Merciful, the Especially Merciful."
  },
  {
    id: 4,
    surah: "Al-Fatiha",
    surahNumber: 1,
    verse: 4,
    arabic: "مَالِكِ يَوْمِ الدِّينِ",
    transliteration: "Maliki yawmi d-din",
    english: "Sovereign of the Day of Recompense."
  },
  {
    id: 5,
    surah: "Al-Fatiha",
    surahNumber: 1,
    verse: 5,
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    transliteration: "Iyyaka na'budu wa iyyaka nasta'in",
    english: "It is You we worship and You we ask for help."
  },
  {
    id: 6,
    surah: "Al-Fatiha",
    surahNumber: 1,
    verse: 6,
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    transliteration: "Ihdina s-sirata l-mustaqim",
    english: "Guide us to the straight path."
  },
  {
    id: 7,
    surah: "Al-Fatiha",
    surahNumber: 1,
    verse: 7,
    arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    transliteration: "Sirata lladhina an'amta 'alayhim ghayri l-maghdubi 'alayhim wa la d-dallin",
    english: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray."
  }
]

export default function Quran() {
  const [selectedSurah, setSelectedSurah] = useState(1)
  const [showTransliteration, setShowTransliteration] = useState(true)
  const [fontSize, setFontSize] = useState('text-lg')

  const filteredVerses = sampleVerses.filter(verse => verse.surahNumber === selectedSurah)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              <h1 className="text-xl font-semibold">Holy Qur'an</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Surah List */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  Surahs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    <Button 
                      variant={selectedSurah === 1 ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedSurah(1)}
                    >
                      <span className="mr-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">1</span>
                      Al-Fatiha
                    </Button>
                    {/* Add more surahs here */}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Font Size:</span>
                    <Button 
                      variant={fontSize === 'text-sm' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setFontSize('text-sm')}
                    >
                      Small
                    </Button>
                    <Button 
                      variant={fontSize === 'text-lg' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setFontSize('text-lg')}
                    >
                      Medium
                    </Button>
                    <Button 
                      variant={fontSize === 'text-xl' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setFontSize('text-xl')}
                    >
                      Large
                    </Button>
                  </div>
                  
                  <Separator orientation="vertical" className="h-6" />
                  
                  <Button
                    variant={showTransliteration ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowTransliteration(!showTransliteration)}
                  >
                    Transliteration
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Surah Header */}
            <Card className="mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold">سُورَة الفَاتِحَة</h2>
                  <h3 className="text-xl opacity-90">Surah Al-Fatiha</h3>
                  <p className="text-sm opacity-75">The Opening • Meccan • 7 verses</p>
                </div>
              </div>
            </Card>

            {/* Verses */}
            <div className="space-y-6">
              {filteredVerses.map((verse) => (
                <Card key={verse.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Verse Number */}
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Verse {verse.verse}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Arabic Text */}
                      <div className="text-right">
                        <p className={`${fontSize === 'text-sm' ? 'text-2xl' : fontSize === 'text-lg' ? 'text-3xl' : 'text-4xl'} leading-relaxed font-arabic text-gray-800 dark:text-gray-100`}>
                          {verse.arabic}
                        </p>
                      </div>

                      {/* Transliteration */}
                      {showTransliteration && (
                        <div className="border-l-4 border-emerald-200 pl-4">
                          <p className="text-emerald-700 dark:text-emerald-300 italic text-sm">
                            {verse.transliteration}
                          </p>
                        </div>
                      )}

                      {/* English Translation */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {verse.english}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" disabled>
                Previous Surah
              </Button>
              <Button variant="outline">
                Next Surah
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}