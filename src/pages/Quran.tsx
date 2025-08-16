import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, BookOpen, Search, Bookmark, BookmarkX, Volume2, Play, Pause, BarChart3, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuran } from '@/hooks/useQuran'
import { useToast } from '@/hooks/use-toast'

export default function Quran() {
  const {
    verses,
    surahs,
    loading,
    error,
    currentSession,
    fetchSurah,
    markVerseAsRead,
    startReadingSession,
    endReadingSession,
    addBookmark,
    removeBookmark,
    isVerseBookmarked,
    isVerseRead,
    getLastReadPosition,
    getReadingStats,
  } = useQuran()

  const { toast } = useToast()
  const [selectedSurah, setSelectedSurah] = useState(1)
  const [showTransliteration, setShowTransliteration] = useState(false)
  const [fontSize, setFontSize] = useState('text-lg')
  const [autoScroll, setAutoScroll] = useState(false)
  const [bookmarkNote, setBookmarkNote] = useState('')
  const [selectedVerse, setSelectedVerse] = useState<{surah: number, verse: number} | null>(null)
  
  const arabicScrollRef = useRef<HTMLDivElement>(null)
  const englishScrollRef = useRef<HTMLDivElement>(null)
  
  const stats = getReadingStats()
  const lastRead = getLastReadPosition()

  // Load initial surah
  useEffect(() => {
    fetchSurah(selectedSurah)
  }, [selectedSurah])

  // Start reading session on mount
  useEffect(() => {
    if (!currentSession) {
      startReadingSession()
    }
  }, [])

  // Synchronized scrolling
  const handleScroll = (source: 'arabic' | 'english') => {
    if (!autoScroll) return
    
    const sourceElement = source === 'arabic' ? arabicScrollRef.current : englishScrollRef.current
    const targetElement = source === 'arabic' ? englishScrollRef.current : arabicScrollRef.current
    
    if (sourceElement && targetElement) {
      const scrollPercentage = sourceElement.scrollTop / (sourceElement.scrollHeight - sourceElement.clientHeight)
      targetElement.scrollTop = scrollPercentage * (targetElement.scrollHeight - targetElement.clientHeight)
    }
  }

  const handleVerseClick = (surahNumber: number, verseNumber: number) => {
    markVerseAsRead(surahNumber, verseNumber)
    setSelectedVerse({ surah: surahNumber, verse: verseNumber })
  }

  const handleBookmark = async (surahNumber: number, verseNumber: number) => {
    if (isVerseBookmarked(surahNumber, verseNumber)) {
      await removeBookmark(surahNumber, verseNumber)
      toast({ title: "Bookmark removed" })
    } else {
      await addBookmark(surahNumber, verseNumber, bookmarkNote)
      toast({ title: "Verse bookmarked" })
      setBookmarkNote('')
    }
  }

  const currentSurah = surahs.find(s => s.number === selectedSurah)

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Failed to load Qur'an data</p>
            <Button onClick={() => fetchSurah(selectedSurah)}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
            {/* Reading Session Status */}
            {currentSession && (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <Play className="h-3 w-3 mr-1" />
                Reading
              </Badge>
            )}
            
            {/* Reading Stats */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reading Progress</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">{stats.totalVersesRead}</div>
                      <div className="text-sm text-muted-foreground">Verses Read</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stats.uniqueSurahs}</div>
                      <div className="text-sm text-muted-foreground">Surahs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600">{stats.totalBookmarks}</div>
                      <div className="text-sm text-muted-foreground">Bookmarks</div>
                    </div>
                  </div>
                  {lastRead && (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Last read:</p>
                      <p className="font-medium">
                        Surah {lastRead.surah_number}, Verse {lastRead.verse_number}
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              size="sm"
              onClick={() => currentSession ? endReadingSession() : startReadingSession()}
            >
              {currentSession ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
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
                    {surahs.map((surah) => (
                      <Button
                        key={surah.number}
                        variant={selectedSurah === surah.number ? "default" : "ghost"}
                        className="w-full justify-start text-left"
                        onClick={() => setSelectedSurah(surah.number)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded min-w-[24px]">
                            {surah.number}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{surah.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{surah.englishName}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
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

                  <Button
                    variant={autoScroll ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoScroll(!autoScroll)}
                  >
                    Sync Scroll
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Surah Header */}
            {currentSurah && (
              <Card className="mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold font-arabic">سُورَة {currentSurah.name}</h2>
                    <h3 className="text-xl opacity-90">Surah {currentSurah.name}</h3>
                    <p className="text-sm opacity-75">
                      {currentSurah.englishName} • {currentSurah.type} • {currentSurah.verses} verses
                    </p>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Reading Progress</span>
                      <span>{verses.filter(v => isVerseRead(v.surah, v.verse)).length}/{verses.length}</span>
                    </div>
                    <Progress 
                      value={(verses.filter(v => isVerseRead(v.surah, v.verse)).length / verses.length) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </Card>
            )}

            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-pulse">Loading verses...</div>
                </CardContent>
              </Card>
            ) : (
              /* Parallel Text Layout */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Arabic Column */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right font-arabic">النص العربي</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea 
                      ref={arabicScrollRef}
                      className="h-[600px]"
                      onScrollCapture={() => handleScroll('arabic')}
                    >
                      <div className="space-y-6 text-right">
                        {verses.map((verse) => (
                          <div 
                            key={verse.id} 
                            className={`p-4 rounded-lg border-r-4 cursor-pointer transition-colors ${
                              isVerseRead(verse.surah, verse.verse) 
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                                : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-25'
                            }`}
                            onClick={() => handleVerseClick(verse.surah, verse.verse)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleBookmark(verse.surah, verse.verse)
                                  }}
                                >
                                  {isVerseBookmarked(verse.surah, verse.verse) ? (
                                    <BookmarkX className="h-4 w-4 text-amber-500" />
                                  ) : (
                                    <Bookmark className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Volume2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                {verse.verse}
                              </Badge>
                            </div>
                            <p className={`${fontSize === 'text-sm' ? 'text-2xl' : fontSize === 'text-lg' ? 'text-3xl' : 'text-4xl'} leading-relaxed font-arabic text-gray-800 dark:text-gray-100`}>
                              {verse.arabic}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* English Column */}
                <Card>
                  <CardHeader>
                    <CardTitle>English Translation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea 
                      ref={englishScrollRef}
                      className="h-[600px]"
                      onScrollCapture={() => handleScroll('english')}
                    >
                      <div className="space-y-6">
                        {verses.map((verse) => (
                          <div 
                            key={verse.id} 
                            className={`p-4 rounded-lg border-l-4 cursor-pointer transition-colors ${
                              isVerseRead(verse.surah, verse.verse) 
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                                : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-25'
                            }`}
                            onClick={() => handleVerseClick(verse.surah, verse.verse)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                {verse.verse}
                              </Badge>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Volume2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleBookmark(verse.surah, verse.verse)
                                  }}
                                >
                                  {isVerseBookmarked(verse.surah, verse.verse) ? (
                                    <BookmarkX className="h-4 w-4 text-amber-500" />
                                  ) : (
                                    <Bookmark className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {verse.translation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                disabled={selectedSurah <= 1}
                onClick={() => setSelectedSurah(selectedSurah - 1)}
              >
                Previous Surah
              </Button>
              <Button 
                variant="outline"
                disabled={selectedSurah >= surahs.length}
                onClick={() => setSelectedSurah(selectedSurah + 1)}
              >
                Next Surah
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bookmark Dialog */}
      {selectedVerse && (
        <Dialog open={!!selectedVerse} onOpenChange={() => setSelectedVerse(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bookmark Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Surah {selectedVerse.surah}, Verse {selectedVerse.verse}
              </p>
              <Textarea
                placeholder="Add a personal note for this verse..."
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedVerse(null)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  handleBookmark(selectedVerse.surah, selectedVerse.verse)
                  setSelectedVerse(null)
                }}>
                  Save Bookmark
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}