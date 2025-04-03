import { useRef, useState } from "react";

const MediaRecorders: React.FC = () => {
  // Создаем реф для видео-элемента
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Создаем реф для MediaRecorder (записывает поток)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  // Создаем реф для хранения MediaStream (поток видео/аудио)
  const streamRef = useRef<MediaStream | null>(null);
  
  // Состояние для отслеживания, идет ли запись
  const [recording, setRecording] = useState(false);
  
  // Состояние для хранения URL записанного видео
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Функция для запуска камеры
  const startCamera = async () => {
    try {
      // Запрашиваем доступ к камере и микрофону
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Создаем новый поток только с видеодорожкой, чтобы избежать эха
      const videoStream = new MediaStream(stream.getVideoTracks());
      
      // Сохраняем оригинальный поток (с аудио) в ref
      streamRef.current = stream;
      
      // Передаем поток в видео-элемент
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }
    } catch (error) {
      console.error("Ошибка доступа к камере:", error);
    }
  };

  const stopCamera = () => {
    // Останавливаем все дорожки (видео и аудио)
    streamRef.current?.getTracks().forEach(track => track.stop());
    
    // Очищаем видео-элемент
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return; // Если потока нет, выходим

    // Создаем объект MediaRecorder для записи потока
    const recorder = new MediaRecorder(streamRef.current);
    
    // Создаем массив для хранения чанков (фрагментов видео)
    const chunks: Blob[] = [];

    // При появлении новых данных добавляем их в массив
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    // Когда запись остановлена, создаем Blob и URL для воспроизведения
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setVideoUrl(URL.createObjectURL(blob));
    };

    recorder.start(); // Начинаем запись
    mediaRecorderRef.current = recorder; // Сохраняем MediaRecorder
    setRecording(true); // Устанавливаем флаг записи
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop(); // Останавливаем MediaRecorder
    setRecording(false); // Сбрасываем флаг записи
  };

  const deleteRecording = () => {
    setVideoUrl(null); // Очищаем URL видео
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted style={{ transform: "scaleX(-1)", width: "100%", maxWidth: "600px" }}></video>
      <div>
        <button onClick={startCamera}>Включить камеру</button>
        <button onClick={stopCamera}>Выключить камеру</button>
        <button onClick={startRecording} disabled={recording}>Начать запись</button>
        <button onClick={stopRecording} disabled={!recording}>Остановить запись</button>
      </div>
      {videoUrl && (
        <div>
          <h3>Записанное видео:</h3>
          <video src={videoUrl} controls style={{ width: "100%", maxWidth: "600px" }}></video>
          <a href={videoUrl} download="recorded-video.webm">Скачать видео</a>
          <button onClick={deleteRecording}>Удалить видео</button>
        </div>
      )}
    </div>
  );
};


export default MediaRecorders;
