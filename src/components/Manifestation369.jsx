import { useState, useEffect } from 'react'
import { Sun, Sunset, Moon, CheckCircle2 } from 'lucide-react'

const sessions = [
  { id: 'morning', name: 'Morning', icon: Sun, time: '6:00 AM - 12:00 PM', repetitions: 3, color: 'from-yellow-400 to-orange-400' },
  { id: 'afternoon', name: 'Afternoon', icon: Sunset, time: '12:00 PM - 6:00 PM', repetitions: 6, color: 'from-orange-400 to-pink-400' },
  { id: 'night', name: 'Night', icon: Moon, time: '6:00 PM - 12:00 AM', repetitions: 9, color: 'from-indigo-400 to-purple-600' },
]

export default function Manifestation369() {
  const [goal, setGoal] = useState('')
  const [currentSession, setCurrentSession] = useState(null)
  const [repetitions, setRepetitions] = useState([])
  const [todayProgress, setTodayProgress] = useState({})

  useEffect(() => {
    // Load today's goal and progress
    const today = new Date().toDateString()
    const savedDate = localStorage.getItem('manifestationDate')
    const savedGoal = localStorage.getItem('manifestationGoal')
    const savedProgress = JSON.parse(localStorage.getItem('manifestationProgress') || '{}')

    if (savedDate !== today) {
      // New day, reset progress
      localStorage.setItem('manifestationDate', today)
      localStorage.setItem('manifestationProgress', '{}')
      setTodayProgress({})
    } else {
      setTodayProgress(savedProgress)
      if (savedGoal) setGoal(savedGoal)
    }
  }, [])

  const startSession = (session) => {
    setCurrentSession(session)
    const reps = Array(session.repetitions).fill('')
    setRepetitions(reps)
  }

  const updateRepetition = (index, value) => {
    const newReps = [...repetitions]
    newReps[index] = value
    setRepetitions(newReps)
  }

  const completeSession = () => {
    if (!goal) {
      alert('Please set a goal first!')
      return
    }

    const allFilled = repetitions.every(rep => rep.trim() !== '')
    if (!allFilled) {
      alert('Please complete all repetitions!')
      return
    }

    // Save to manifestation history
    const manifestations = JSON.parse(localStorage.getItem('manifestations') || '[]')
    const entry = {
      id: Date.now(),
      goal: goal,
      session: currentSession.id,
      repetitions: repetitions,
      date: new Date().toISOString()
    }
    manifestations.push(entry)
    localStorage.setItem('manifestations', JSON.stringify(manifestations))

    // Update progress
    const newProgress = { ...todayProgress, [currentSession.id]: true }
    setTodayProgress(newProgress)
    localStorage.setItem('manifestationProgress', JSON.stringify(newProgress))
    localStorage.setItem('manifestationGoal', goal)

    // Reset
    setCurrentSession(null)
    setRepetitions([])
    alert('Session completed! Great work! 🎉')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">369 Manifestation Method</h2>
        <p className="text-gray-600 mb-4">
          Write your goal 3 times in the morning, 6 times in the afternoon, and 9 times at night.
        </p>
      </div>

      {!currentSession ? (
        <>
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              What is your manifestation goal for today?
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="I am confident and successful..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Your Session</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sessions.map((session) => {
                const Icon = session.icon
                const completed = todayProgress[session.id]
                return (
                  <button
                    key={session.id}
                    onClick={() => !completed && goal && startSession(session)}
                    disabled={completed || !goal}
                    className={`relative p-6 rounded-xl bg-gradient-to-br ${session.color} text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {completed && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="text-white" size={24} />
                      </div>
                    )}
                    <Icon size={40} className="mb-4" />
                    <h4 className="text-xl font-bold mb-2">{session.name}</h4>
                    <p className="text-sm mb-2">{session.time}</p>
                    <p className="text-2xl font-bold">{session.repetitions}x</p>
                    {completed && <p className="text-sm mt-2 font-semibold">✓ Completed</p>}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Today's Progress</h4>
            <div className="flex space-x-4">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{session.name}:</span>
                  <span className={`text-sm font-semibold ${todayProgress[session.id] ? 'text-green-600' : 'text-gray-400'}`}>
                    {todayProgress[session.id] ? '✓' : '○'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{currentSession.name} Session</h3>
              <p className="text-gray-600">Write your goal {currentSession.repetitions} times</p>
            </div>
            <button
              onClick={() => setCurrentSession(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="font-medium text-gray-800">Your Goal:</p>
            <p className="text-lg text-purple-700 font-semibold">{goal}</p>
          </div>

          <div className="space-y-3">
            {repetitions.map((rep, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-lg font-semibold text-gray-600 w-8">{index + 1}.</span>
                <input
                  type="text"
                  value={rep}
                  onChange={(e) => updateRepetition(index, e.target.value)}
                  placeholder={goal || 'Write your goal here...'}
                  className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <button
            onClick={completeSession}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Complete Session
          </button>
        </div>
      )}
    </div>
  )
}
