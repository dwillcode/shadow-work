# Shadow Work & 369 Manifestation App

A personal development React application combining Shadow Work journaling with the 369 Manifestation Method.

## Features

### 🌙 Shadow Work Tab
- Daily rotating prompts for self-reflection
- Mood selector (Happy, Neutral, Sad)
- Multiple entry types:
  - Text journaling
  - Audio recording (via MediaRecorder API)
  - Video recording (via MediaRecorder API)
- All entries stored in localStorage

### 🎯 369 Manifestation Tab
- Write your goal 3x in morning, 6x in afternoon, 9x at night
- Session-based tracking with progress indicators
- Goal persistence across sessions
- Visual feedback for completed sessions

### 📚 History Tab
- View all entries (Shadow Work and 369)
- Filter by type (All, Shadow Work, 369)
- Expand/collapse entries to see full details
- Delete entries with confirmation

### 📊 Insights Tab
- Streak counters for Shadow Work and 369 practice
- Total entry counts
- Mood distribution chart
- 7-day activity chart

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling with custom indigo-purple-pink gradient theme
- **Lucide React** - Icon library
- **localStorage** - Data persistence (no server required)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

## Data Structure

All data is stored in localStorage:

### Shadow Work Entries
```javascript
{
  id: number,
  text: string,
  prompt: string,
  mood: 'happy' | 'neutral' | 'sad',
  date: string (ISO),
  type: 'text' | 'audio' | 'video',
  mediaData: string (base64) | null
}
```

### 369 Manifestation Entries
```javascript
{
  id: number,
  goal: string,
  session: 'morning' | 'afternoon' | 'night',
  repetitions: string[],
  date: string (ISO)
}
```

## Browser Permissions

The app requests microphone and camera permissions when using audio/video recording features. These are optional and text-based entries work without any permissions.
