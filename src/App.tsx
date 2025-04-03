import { useState } from 'react';
import './App.css';
import MediaRecorders from './components/MediaRecorders';
import CanvasCapture from './components/CanvasCapture';

function App() {
  const [isVideo, setIsVideo] = useState<boolean | null>(null);

  return (
    <div className='w-full h-full flex flex-col items-start'>
      <div className='flex w-full justify-center'>
        <button onClick={() => setIsVideo(true)}>Видео</button>
        <button onClick={() => setIsVideo(false)}>Canvas</button>
      </div>
      
      {isVideo === null ? null : isVideo ? <MediaRecorders /> : <CanvasCapture />}
    </div>
  );
}

export default App;
