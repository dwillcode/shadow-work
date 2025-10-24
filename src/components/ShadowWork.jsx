import { useState, useEffect, useRef } from 'react'
import { Mic, Video, Save, Smile, Frown, Meh } from 'lucide-react'

const prompts = [
  "What aspect of yourself are you avoiding today?",
  "What emotions are you suppressing right now?",
  "What would you do if you weren't afraid of judgment?",
  "What patterns keep repeating in your life?",
  "What truth are you avoiding?",
  "What do you need to forgive yourself for?",
  "What makes you feel vulnerable?",
  "What belief is holding you back?",
  "What would your authentic self say right now?",
  "What are you grateful for today?",
]

const moods = [
  { icon: Smile, label: 'Happy', value: 'happy', color: 'text-green-500' },
  { icon: Meh, label: 'Neutral', value: 'neutral', color: 'text-yellow-500' },
  { icon: Frown, label: 'Sad', value: 'sad', color: 'text-blue-500' },
]

export default function ShadowWork() {
  const [text, setText] = useState('')
  const [selectedMood, setSelectedMood] = useState('neutral')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingType, setRecordingType] = useState(null)
  const [mediaUrl, setMediaUrl] = useState(null)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  useEffect(() => {
    // Get daily prompt based on date
    const today = new Date().toDateString()
    const savedPromptDate = localStorage.getItem('promptDate')
    
    if (savedPromptDate !== today) {
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
      setCurrentPrompt(randomPrompt)
      localStorage.setItem('promptDate', today)
      localStorage.setItem('currentPrompt', randomPrompt)
    } else {
      setCurrentPrompt(localStorage.getItem('currentPrompt') || prompts[0])
    }
  }, [])

  const startRecording = async (type) => {
    try {
      const constraints = type === 'audio' 
        ? { audio: true }
        : { audio: true, video: true }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { 
          type: type === 'audio' ? 'audio/webm' : 'video/webm' 
        })
        const url = URL.createObjectURL(blob)
        setMediaUrl(url)
        
        // Convert to base64 for localStorage
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64data = reader.result
          saveEntry(type, base64data)
        }
        reader.readAsDataURL(blob)
        
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingType(type)
    } catch (err) {
      console.error('Error accessing media devices:', err)
      alert('Could not access camera/microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const saveEntry = (type, mediaData = null) => {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]')
    
    const entry = {
      id: Date.now(),
      text: text,
      prompt: currentPrompt,
      mood: selectedMood,
      date: new Date().toISOString(),
      type: type || 'text',
      mediaData: mediaData
    }

    entries.push(entry)
    localStorage.setItem('entries', JSON.stringify(entries))
    
    // Reset form
    setText('')
    setMediaUrl(null)
    setRecordingType(null)
    alert('Entry saved successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Prompt</h2>
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
          <p className="text-lg text-gray-800 font-medium italic">"{currentPrompt}"</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">How are you feeling?</h3>
        <div className="flex space-x-4">
          {moods.map((mood) => {
            const Icon = mood.icon
            return (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all ${
                  selectedMood === mood.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <Icon className={`${mood.color} ${selectedMood === mood.value ? 'scale-125' : ''}`} size={32} />
                <span className="text-sm font-medium">{mood.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Response</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Or Record Your Response</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => isRecording && recordingType === 'audio' ? stopRecording() : startRecording('audio')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isRecording && recordingType === 'audio'
                ? 'bg-red-500 text-white'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            <Mic size={20} />
            <span>{isRecording && recordingType === 'audio' ? 'Stop Recording' : 'Record Audio'}</span>
          </button>
          
          <button
            onClick={() => isRecording && recordingType === 'video' ? stopRecording() : startRecording('video')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isRecording && recordingType === 'video'
                ? 'bg-red-500 text-white'
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
          >
            <Video size={20} />
            <span>{isRecording && recordingType === 'video' ? 'Stop Recording' : 'Record Video'}</span>
          </button>
        </div>

        {mediaUrl && (
          <div className="mt-4">
            {recordingType === 'audio' ? (
              <audio controls src={mediaUrl} className="w-full" />
            ) : (
              <video controls src={mediaUrl} className="w-full rounded-lg" />
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => saveEntry('text')}
          disabled={!text && !mediaUrl}
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Save size={20} />
          <span>Save Entry</span>
        </button>
      </div>
    </div>
  )
}
