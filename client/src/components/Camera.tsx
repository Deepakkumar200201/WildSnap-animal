import React, { useEffect, useRef, useState } from "react";

interface CameraProps {
  onCapture: (imageBlob: Blob) => void;
  onClose: () => void;
}

export default function Camera({ onCapture, onClose }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  useEffect(() => {
    // Initialize camera when component mounts
    startCamera();

    // Clean up when component unmounts
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      if (stream) {
        stopCamera();
      }

      const constraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access the camera. Please ensure you've granted camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            stopCamera();
            onCapture(blob);
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

  return (
    <div className="flex-grow flex flex-col">
      <div className="bg-black mb-4 rounded-lg overflow-hidden shadow-md" style={{ aspectRatio: '4/3' }}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
          aria-label="Camera preview"
        ></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
      
      <div className="flex justify-between items-center">
        <button 
          onClick={switchCamera}
          className="p-3 rounded-full bg-white shadow-md"
          aria-label="Switch camera"
        >
          <span className="text-xl"><i className="ri-refresh-line"></i></span>
        </button>
        
        <button 
          onClick={handleCapture}
          className="w-16 h-16 rounded-full bg-white border-4 border-primary flex items-center justify-center shadow-md"
          aria-label="Capture photo"
        >
          <div className="w-12 h-12 rounded-full bg-primary"></div>
        </button>
        
        <button 
          onClick={onClose}
          className="p-3 rounded-full bg-white shadow-md"
          aria-label="Close camera"
        >
          <span className="text-xl"><i className="ri-close-line"></i></span>
        </button>
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-4">
        Position the animal in the frame and tap the button to capture
      </p>
    </div>
  );
}
