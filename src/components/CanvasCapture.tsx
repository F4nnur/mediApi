import { useRef, useState } from "react";

const CanvasCapture = () => {
  // Реф для видео-элемента, чтобы получать поток с камеры
  const videoRef = useRef<HTMLVideoElement>(null);

  // Реф для canvas, на который будем рисовать снимки
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Состояние для хранения URL снимка
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      // Запрашиваем у пользователя доступ к камере
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Передаем поток в видео-элемент
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Ошибка доступа к камере:", error);
    }
  };

  const stopCamera = () => {
    // Получаем поток, связанный с видео-элементом
    const stream = videoRef.current?.srcObject as MediaStream;

    // Останавливаем все треки (видео и аудио, если есть)
    stream?.getTracks().forEach((track) => track.stop());

    // Очищаем источник видео-элемента
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Функция для создания снимка с камеры
  const takeSnapshot = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (videoRef.current && ctx && canvas) {
      // Устанавливаем размеры canvas такими же, как у видео
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Рисуем текущее изображение с камеры на canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Сохраняем снимок в состояние (data URL формата base64)
      setSnapshotUrl(canvas.toDataURL("image/png"));
    }
  };

  const deleteSnapshot = () => {
    setSnapshotUrl(null);
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", maxWidth: "600px" }}
      ></video>
      <div>
        <button onClick={startCamera}>Включить камеру</button>
        <button onClick={stopCamera}>Выключить камеру</button>
        <button onClick={takeSnapshot}>Сделать снимок</button>
      </div>
      {snapshotUrl && (
        <div>
          <img src={snapshotUrl} alt="Снимок" style={{ maxWidth: "100%" }} />
          <button onClick={deleteSnapshot}>Удалить снимок</button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default CanvasCapture;
