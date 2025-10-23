import { useState, useEffect } from 'react'
import { Flame, TrendingUp, Calendar, Smile, Frown, Meh } from 'lucide-react'

export default function Insights() {
  const [shadowStreak, setShadowStreak] = useState(0)
  const [manifestationStreak, setManifestationStreak] = useState(0)
  const [moodData, setMoodData] = useState({ happy: 0, neutral: 0, sad: 0 })
  const [totalEntries, setTotalEntries] = useState(0)
  const [totalManifestations, setTotalManifestations] = useState(0)
  const [weeklyActivity, setWeeklyActivity] = useState([])

  useEffect(() => {
    calculateInsights()
  }, [])

  const calculateInsights = () => {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]')
    const manifestations = JSON.parse(localStorage.getItem('manifestations') || '[]')

    // Total counts
    setTotalEntries(entries.length)
    setTotalManifestations(manifestations.length)

    // Calculate mood distribution
    const moods = { happy: 0, neutral: 0, sad: 0 }
    entries.forEach(entry => {
      if (entry.mood) {
        moods[entry.mood] = (moods[entry.mood] || 0) + 1
      }
    })
    setMoodData(moods)

    // Calculate shadow work streak
    const shadowStreak = calculateStreak(entries)
    setShadowStreak(shadowStreak)

    // Calculate manifestation streak
    const manifestationStreak = calculateStreak(manifestations)
    setManifestationStreak(manifestationStreak)

    // Calculate weekly activity (last 7 days)
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toDateString()
      
      const dayEntries = entries.filter(e => 
        new Date(e.date).toDateString() === dateString
      ).length
      
      const dayManifestations = manifestations.filter(m => 
        new Date(m.date).toDateString() === dateString
      ).length
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
        count: dayEntries + dayManifestations
      })
    }
    setWeeklyActivity(last7Days)
  }

  const calculateStreak = (items) => {
    if (items.length === 0) return 0

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    // Check if there's an entry today
    const hasToday = items.some(item => {
      const itemDate = new Date(item.date)
      itemDate.setHours(0, 0, 0, 0)
      return itemDate.getTime() === currentDate.getTime()
    })

    if (!hasToday) {
      // Check if there was one yesterday to continue the streak
      currentDate.setDate(currentDate.getDate() - 1)
      const hasYesterday = items.some(item => {
        const itemDate = new Date(item.date)
        itemDate.setHours(0, 0, 0, 0)
        return itemDate.getTime() === currentDate.getTime()
      })
      if (!hasYesterday) return 0
      streak = 1
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      streak = 1
      currentDate.setDate(currentDate.getDate() - 1)
    }

    // Count consecutive days
    while (true) {
      const hasEntry = items.some(item => {
        const itemDate = new Date(item.date)
        itemDate.setHours(0, 0, 0, 0)
        return itemDate.getTime() === currentDate.getTime()
      })

      if (hasEntry) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  const maxActivity = Math.max(...weeklyActivity.map(d => d.count), 1)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Insights</h2>

      {/* Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-2">
            <Flame size={32} />
            <h3 className="text-xl font-bold">Shadow Work Streak</h3>
          </div>
          <p className="text-4xl font-bold">{shadowStreak}</p>
          <p className="text-sm mt-2">days in a row</p>
        </div>

        <div className="bg-gradient-to-br from-purple-400 to-indigo-500 text-white p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-2">
            <Flame size={32} />
            <h3 className="text-xl font-bold">369 Streak</h3>
          </div>
          <p className="text-4xl font-bold">{manifestationStreak}</p>
          <p className="text-sm mt-2">days in a row</p>
        </div>
      </div>

      {/* Total Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="text-purple-600" size={28} />
            <h3 className="text-lg font-bold text-gray-800">Total Shadow Work</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">{totalEntries}</p>
          <p className="text-sm text-gray-600 mt-1">entries completed</p>
        </div>

        <div className="bg-indigo-50 p-6 rounded-xl border-2 border-indigo-200">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="text-indigo-600" size={28} />
            <h3 className="text-lg font-bold text-gray-800">Total 369 Sessions</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{totalManifestations}</p>
          <p className="text-sm text-gray-600 mt-1">manifestations written</p>
        </div>
      </div>

      {/* Mood Chart */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Mood Distribution</h3>
        {totalEntries === 0 ? (
          <p className="text-gray-500 text-center py-8">No mood data yet</p>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Smile className="text-green-500" size={24} />
                  <span className="font-semibold text-gray-700">Happy</span>
                </div>
                <span className="text-gray-600">{moodData.happy}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${(moodData.happy / totalEntries) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Meh className="text-yellow-500" size={24} />
                  <span className="font-semibold text-gray-700">Neutral</span>
                </div>
                <span className="text-gray-600">{moodData.neutral}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full transition-all"
                  style={{ width: `${(moodData.neutral / totalEntries) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Frown className="text-blue-500" size={24} />
                  <span className="font-semibold text-gray-700">Sad</span>
                </div>
                <span className="text-gray-600">{moodData.sad}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${(moodData.sad / totalEntries) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Activity */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Last 7 Days Activity</h3>
        <div className="flex items-end justify-between space-x-2 h-48">
          {weeklyActivity.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              <div className="flex-1 w-full flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all hover:from-purple-600 hover:to-pink-600"
                  style={{ height: `${(day.count / maxActivity) * 100}%`, minHeight: day.count > 0 ? '10%' : '0%' }}
                  title={`${day.count} entries`}
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 font-medium">{day.date.split(' ')[0]}</p>
                <p className="text-xs text-gray-500">{day.date.split(' ')[1]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
