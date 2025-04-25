import React from "react";

interface LoadingViewProps {
  imageSrc: string;
}

export default function LoadingView({ imageSrc }: LoadingViewProps) {
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-8">
      <div className="mb-6 w-full max-w-md aspect-square rounded-lg overflow-hidden relative shadow-md">
        <img 
          src={imageSrc} 
          alt="Processing image" 
          className="w-full h-full object-contain bg-gray-100"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-foreground">Identifying Animal...</p>
            <p className="text-sm text-muted-foreground mt-1">Using Gemini AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
