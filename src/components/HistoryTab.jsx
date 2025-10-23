import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Trash2, Smile, Frown, Meh, BookHeart, Target } from 'lucide-react'

const moodIcons = {
  happy: { icon: Smile, color: 'text-green-500' },
  neutral: { icon: Meh, color: 'text-yellow-500' },
  sad: { icon: Frown, color: 'text-blue-500' },
}

export default function HistoryTab() {
  const [entries, setEntries] = useState([])
  const [manifestations, setManifestations] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'shadow', 'manifestation'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const shadowEntries = JSON.parse(localStorage.getItem('entries') || '[]')
    const manifestationEntries = JSON.parse(localStorage.getItem('manifestations') || '[]')
    
    setEntries(shadowEntries.map(e => ({ ...e, category: 'shadow' })))
    setManifestations(manifestationEntries.map(m => ({ ...m, category: 'manifestation' })))
  }

  const deleteEntry = (id, category) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      if (category === 'shadow') {
        const updated = entries.filter(e => e.id !== id)
        setEntries(updated)
        localStorage.setItem('entries', JSON.stringify(updated.map(({ category, ...rest }) => rest)))
      } else {
        const updated = manifestations.filter(m => m.id !== id)
        setManifestations(updated)
        localStorage.setItem('manifestations', JSON.stringify(updated.map(({ category, ...rest }) => rest)))
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const allItems = [...entries, ...manifestations]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter(item => filter === 'all' || item.category === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">History</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('shadow')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'shadow'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Shadow Work
          </button>
          <button
            onClick={() => setFilter('manifestation')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'manifestation'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            369
          </button>
        </div>
      </div>

      {allItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No entries yet. Start your journey!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allItems.map((item) => {
            const isExpanded = expandedId === item.id
            const isShadow = item.category === 'shadow'
            
            return (
              <div
                key={item.id}
                className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-purple-300 transition-all"
              >
                <div
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 cursor-pointer"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {isShadow ? (
                          <BookHeart className="text-purple-600" size={20} />
                        ) : (
                          <Target className="text-indigo-600" size={20} />
                        )}
                        <span className="font-semibold text-gray-800">
                          {isShadow ? 'Shadow Work' : '369 Manifestation'}
                        </span>
                        {isShadow && item.mood && (
                          <span className="flex items-center space-x-1">
                            {(() => {
                              const MoodIcon = moodIcons[item.mood]?.icon
                              return MoodIcon ? (
                                <MoodIcon className={moodIcons[item.mood].color} size={18} />
                              ) : null
                            })()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{formatDate(item.date)}</p>
                      {!isExpanded && (
                        <p className="text-gray-700 mt-2 line-clamp-2">
                          {isShadow 
                            ? (item.prompt || item.text) 
                            : `Goal: ${item.goal}`
                          }
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteEntry(item.id, item.category)
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg transition-all"
                      >
                        <Trash2 className="text-red-500" size={18} />
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="text-gray-600" size={24} />
                      ) : (
                        <ChevronDown className="text-gray-600" size={24} />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-white space-y-4">
                    {isShadow ? (
                      <>
                        {item.prompt && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Prompt:</h4>
                            <p className="text-gray-700 italic">"{item.prompt}"</p>
                          </div>
                        )}
                        {item.text && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Response:</h4>
                            <p className="text-gray-700 whitespace-pre-wrap">{item.text}</p>
                          </div>
                        )}
                        {item.mediaData && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Recording:</h4>
                            {item.type === 'audio' ? (
                              <audio controls src={item.mediaData} className="w-full" />
                            ) : item.type === 'video' ? (
                              <video controls src={item.mediaData} className="w-full rounded-lg" />
                            ) : null}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Goal:</h4>
                          <p className="text-gray-700 font-medium">{item.goal}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Session: <span className="capitalize">{item.session}</span>
                          </h4>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Repetitions:</h4>
                          <ol className="list-decimal list-inside space-y-1">
                            {item.repetitions?.map((rep, idx) => (
                              <li key={idx} className="text-gray-700">{rep}</li>
                            ))}
                          </ol>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
