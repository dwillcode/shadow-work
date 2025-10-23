import { useState } from 'react'
import { BookHeart, Target, History, TrendingUp } from 'lucide-react'
import ShadowWork from './components/ShadowWork'
import Manifestation369 from './components/Manifestation369'
import HistoryTab from './components/HistoryTab'
import Insights from './components/Insights'

function App() {
  const [activeTab, setActiveTab] = useState('shadow')

  const tabs = [
    { id: 'shadow', name: 'Shadow Work', icon: BookHeart },
    { id: '369', name: '369', icon: Target },
    { id: 'history', name: 'History', icon: History },
    { id: 'insights', name: 'Insights', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Shadow Work & Manifestation</h1>
          <p className="text-white/80">Your personal journey to self-discovery and manifestation</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Icon size={20} />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-2xl p-6 min-h-[600px]">
          {activeTab === 'shadow' && <ShadowWork />}
          {activeTab === '369' && <Manifestation369 />}
          {activeTab === 'history' && <HistoryTab />}
          {activeTab === 'insights' && <Insights />}
        </div>
      </div>
    </div>
  )
}

export default App
