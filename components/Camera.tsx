import React, { useRef, useState, useEffect } from 'react';

interface CameraProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }, // Prefer back camera
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Não foi possível acessar a câmera. Verifique as permissões.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageSrc);
      }
    }
  };

  if (error) {
    return (
      <div className="text-center p-6 text-red-600 bg-red-50 rounded-lg">
        <p>{error}</p>
        <button onClick={onCancel} className="mt-4 px-4 py-2 bg-gray-200 rounded text-gray-800">Voltar</button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full bg-black rounded-xl overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        style={{ minHeight: '300px' }}
      />
      
      {/* Overlay controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center">
        <button 
          onClick={onCancel}
          className="text-white p-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <button 
          onClick={handleCapture}
          className="w-16 h-16 rounded-full border-4 border-white bg-transparent flex items-center justify-center hover:bg-white/20 active:bg-white/40 transition-all"
        >
          <div className="w-12 h-12 bg-white rounded-full"></div>
        </button>

        <div className="w-10"></div> {/* Spacer for centering */}
      </div>
    </div>
  );
};

export default Camera;
