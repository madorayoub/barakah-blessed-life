import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'

// Surah metadata
const surahs = [
  { number: 1, name: "Al-Fatiha", englishName: "The Opening", type: "Meccan", verses: 7 },
  { number: 2, name: "Al-Baqarah", englishName: "The Cow", type: "Medinan", verses: 286 },
  { number: 3, name: "Ali 'Imran", englishName: "Family of Imran", type: "Medinan", verses: 200 },
  { number: 4, name: "An-Nisa", englishName: "The Women", type: "Medinan", verses: 176 },
  { number: 5, name: "Al-Ma'idah", englishName: "The Table Spread", type: "Medinan", verses: 120 },
  // Add more surahs as needed...
]

interface Verse {
  id: number
  surah: number
  verse: number
  arabic: string
  translation: string
  transliteration?: string
}

interface QuranProgress {
  id: string
  surah_number: number
  verse_number: number
  last_read_at: string
  reading_session_id?: string
}

interface QuranBookmark {
  id: string
  surah_number: number
  verse_number: number
  note?: string
  created_at: string
}

interface ReadingSession {
  id: string
  start_time: string
  end_time?: string
  total_verses_read: number
  surahs_read: number[]
}

export const useQuran = () => {
  const { user } = useAuth()
  const [verses, setVerses] = useState<Verse[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<QuranProgress[]>([])
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([])
  const [currentSession, setCurrentSession] = useState<ReadingSession | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch verses from Al Quran Cloud API
  const fetchSurah = async (surahNumber: number) => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch Arabic text
      const arabicResponse = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}`
      )
      const arabicData = await arabicResponse.json()
      
      // Fetch English translation
      const englishResponse = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`
      )
      const englishData = await englishResponse.json()

      if (arabicData.code === 200 && englishData.code === 200) {
        const versesData: Verse[] = arabicData.data.ayahs.map((ayah: any, index: number) => ({
          id: ayah.number,
          surah: surahNumber,
          verse: ayah.numberInSurah,
          arabic: ayah.text,
          translation: englishData.data.ayahs[index]?.text || '',
        }))
        
        setVerses(versesData)
      } else {
        throw new Error('Failed to fetch Quran data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Quran data')
    } finally {
      setLoading(false)
    }
  }

  // Load user's reading progress
  const loadProgress = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('quran_reading_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_read_at', { ascending: false })

      if (error) throw error
      setProgress(data || [])
    } catch (err) {
      console.error('Failed to load reading progress:', err)
    }
  }

  // Load user's bookmarks
  const loadBookmarks = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('quran_bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (err) {
      console.error('Failed to load bookmarks:', err)
    }
  }

  // Mark verse as read
  const markVerseAsRead = async (surahNumber: number, verseNumber: number) => {
    if (!user || !currentSession) return

    try {
      const { error } = await supabase
        .from('quran_reading_progress')
        .upsert({
          user_id: user.id,
          surah_number: surahNumber,
          verse_number: verseNumber,
          reading_session_id: currentSession.id,
          last_read_at: new Date().toISOString(),
        })

      if (error) throw error

      // Update current session
      const { error: sessionError } = await supabase
        .from('quran_reading_sessions')
        .update({
          total_verses_read: currentSession.total_verses_read + 1,
          surahs_read: [...new Set([...currentSession.surahs_read, surahNumber])],
        })
        .eq('id', currentSession.id)

      if (sessionError) throw sessionError

      await loadProgress()
    } catch (err) {
      console.error('Failed to mark verse as read:', err)
    }
  }

  // Start reading session
  const startReadingSession = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('quran_reading_sessions')
        .insert({
          user_id: user.id,
          start_time: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      setCurrentSession(data)
    } catch (err) {
      console.error('Failed to start reading session:', err)
    }
  }

  // End reading session
  const endReadingSession = async () => {
    if (!currentSession) return

    try {
      const { error } = await supabase
        .from('quran_reading_sessions')
        .update({
          end_time: new Date().toISOString(),
        })
        .eq('id', currentSession.id)

      if (error) throw error
      setCurrentSession(null)
    } catch (err) {
      console.error('Failed to end reading session:', err)
    }
  }

  // Add bookmark
  const addBookmark = async (surahNumber: number, verseNumber: number, note?: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('quran_bookmarks')
        .upsert({
          user_id: user.id,
          surah_number: surahNumber,
          verse_number: verseNumber,
          note: note || null,
        })

      if (error) throw error
      await loadBookmarks()
    } catch (err) {
      console.error('Failed to add bookmark:', err)
    }
  }

  // Remove bookmark
  const removeBookmark = async (surahNumber: number, verseNumber: number) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('quran_bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('surah_number', surahNumber)
        .eq('verse_number', verseNumber)

      if (error) throw error
      await loadBookmarks()
    } catch (err) {
      console.error('Failed to remove bookmark:', err)
    }
  }

  // Check if verse is bookmarked
  const isVerseBookmarked = (surahNumber: number, verseNumber: number) => {
    return bookmarks.some(
      b => b.surah_number === surahNumber && b.verse_number === verseNumber
    )
  }

  // Check if verse is read
  const isVerseRead = (surahNumber: number, verseNumber: number) => {
    return progress.some(
      p => p.surah_number === surahNumber && p.verse_number === verseNumber
    )
  }

  // Get last read position
  const getLastReadPosition = () => {
    if (progress.length === 0) return null
    return progress[0]
  }

  // Get reading statistics
  const getReadingStats = () => {
    const totalVersesRead = progress.length
    const uniqueSurahs = new Set(progress.map(p => p.surah_number)).size
    const totalBookmarks = bookmarks.length
    
    return {
      totalVersesRead,
      uniqueSurahs,
      totalBookmarks,
    }
  }

  useEffect(() => {
    if (user) {
      loadProgress()
      loadBookmarks()
    }
  }, [user])

  return {
    // Data
    verses,
    surahs,
    progress,
    bookmarks,
    currentSession,
    loading,
    error,
    
    // Actions
    fetchSurah,
    markVerseAsRead,
    startReadingSession,
    endReadingSession,
    addBookmark,
    removeBookmark,
    
    // Utilities
    isVerseBookmarked,
    isVerseRead,
    getLastReadPosition,
    getReadingStats,
  }
}