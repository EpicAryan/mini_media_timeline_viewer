# Mini Media Timeline Viewer

A professional-grade media timeline viewer built with React, Redux Toolkit, and Tailwind CSS. This application provides comprehensive video editing capabilities with timeline management, media trimming, and export functionality.

---

## Features Implemented

### **Core Functionality**
- **Media Upload** – Drag & drop or click to upload video, audio, and image files.
- **Timeline View** – Professional timeline with visual media blocks and time rulers.
- **Media Trimming** – Precise trim controls with real-time preview.
- **Media Playback** – Integrated player supporting video, audio, and images.
- **Export System** – Export trimmed media using FFmpeg.wasm.

### **Advanced UI/UX**
- **Visual Timeline** – Shows full media duration with trimmed sections highlighted.
- **Zoom Controls** – Scale timeline for precise editing (10%-500%).
- **Responsive Design** – Optimized for 13" laptops and larger displays.
- **Dark Theme** – Professional dark interface with color-coded media types.

### **Keyboard Shortcuts**
| Key             | Action                              |
|-----------------|-------------------------------------|
| Space / K       | Play/Pause toggle                   |
| ← / →           | Seek backward/forward 5 seconds     |



### **Technical Excellence**
- **TypeScript** – Full type safety with proper Redux typing.
- **Redux Toolkit** – Modern state management with `createSlice`.
- **Performance Optimized** – Efficient rendering and memory management.
- **Error Handling** – Graceful handling of file upload and processing errors.
- **Accessibility** – ARIA labels, keyboard navigation, screen reader support.

---

## Setup Instructions

### **Prerequisites**
- Node.js v20+
- npm or yarn package manager

### **Installation**
```bash
# Clone the repository
git clone <your-repo-url>
cd mini-media-timeline-viewer

# Install dependencies
npm install
# or
yarn install
````

### **Start Development Server**

```bash
npm run dev
# or
yarn dev
```

Then open:

```
http://localhost:3000
```

### **Build for Production**

```bash
npm run build
# or
yarn build
```


---

## Project Structure

```
src/
├── components/                 
│   ├── ui/                    
│   │   ├── Button.tsx         
│   │   ├── Input.tsx          
│   │   ├── Modal.tsx          
│   │   ├── LoadingSpinner.tsx 
│   │   └── ExportModal.tsx    
│   ├── media/                 
│   │   ├── MediaUploader.tsx  
│   │   ├── MediaPlayer.tsx    
│   │   └── TrimControls.tsx   
│   ├── timeline/              
│   │   ├── Timeline.tsx       
│   │   ├── TimelineRuler.tsx  
│   │   ├── TimelineTrack.tsx  
│   │   ├── TimelinePlayhead.tsx
│   │   └── TimelineSidebar.tsx
│   └── layout/                
│       ├── Header.tsx         
│       └── MainLayout.tsx     
├── store/                     
│   ├── index.ts                          
│   ├── types.ts              
│   └── slices/               
│       ├── mediaSlice.ts     
│       ├── playerSlice.ts    
│       └── timelineSlice.ts  
├── hooks/                    
│   ├── useMediaPlayer.ts     
│   ├── useMediaUpload.ts     
│   ├── useMediaExport.ts     
│   ├── useFFmpeg.ts          
│   └── useKeyboardShortcuts.ts
├── utils/                    
│   ├── mediaUtils.ts             
│   ├── constants.ts          
│   └── cn.ts                 
          
```

---

## Attention to Detail Examples

### **1. Pixel-Perfect Timeline Alignment**

```ts
const getSubdivisions = (second: number) => {
  const subdivisions = []
  for (let i = 1; i < 10; i++) {
    subdivisions.push(second + i * 0.1)
  }
  return subdivisions
}
```

### **2. Precise Trim Playback Control**

```ts
useEffect(() => {
  const handleTimeUpdate = () => {
    if (video.currentTime >= activeFile.trimEnd) {
      video.pause()
      video.currentTime = activeFile.trimStart
      dispatch(togglePlayPause())
    }
  }
  
  video.addEventListener('timeupdate', handleTimeUpdate)
  return () => video.removeEventListener('timeupdate', handleTimeUpdate)
}, [activeFile, dispatch])
```

### **3. Intelligent Keyboard Shortcuts**

```ts
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    const isInputFocused = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true'
```

### **4. Robust Error Handling**

```ts
export const saveToStorage = <T>(key: string, value: T): boolean => {
  try {
    if (typeof window === 'undefined') return false
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Failed to save to localStorage key: ${key}`, error)
    return false
  }
}
```

### **5. Professional Visual States**

```ts
const getMediaColors = () => {
  switch (file.type) {
    case 'video':
      return {
        full: 'bg-media-video/30',
        trimmed: 'bg-media-video',
        border: 'border-purple-400/50'
      }
  }
}
```


---

## Technical Implementation Details

### **State Management Architecture**

* Normalized state structure.
* Immutable updates with Immer.
* Typed actions via TypeScript.

### **Performance Optimizations**

* `React.memo` to prevent unnecessary re-renders.
* `useCallback` for stable function references.
* Debounced operations for smooth UX.
* Efficient selectors to minimize state subscriptions.

### **Cross-Browser Compatibility**

* Chrome, Firefox, Safari, Edge supported.
* Responsive design.
* Progressive enhancement for degraded environments.

---

## Usage Examples

### **Basic Workflow**

    1. Upload media.
    2. Set trim points.
    3. Preview.
    4. Fine-tune.
    5. Export.

### **Advanced Features**

* Timeline zooming.
* Keyboard editing workflow.
* Export Trim Videos, Audios
* Multi-format support.

---

## Technology Stack

* Nextjs 15+
* TypeScript
* Redux Toolkit
* Tailwind CSS
* FFmpeg.wasm

---

