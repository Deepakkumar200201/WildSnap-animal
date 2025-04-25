import React from "react";

interface ErrorViewProps {
  message: string;
  onTryAgain: () => void;
  onBackToHome: () => void;
}

export default function ErrorView({ message, onTryAgain, onBackToHome }: ErrorViewProps) {
  const defaultMessage = "We couldn't identify the animal in this image. Please ensure the animal is clearly visible and try again.";
  
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-8">
      <div className="text-center max-w-md">
        <div className="inline-block p-4 bg-destructive bg-opacity-10 rounded-full mb-4">
          <span className="text-destructive text-4xl"><i className="ri-error-warning-line"></i></span>
        </div>
        <h2 className="text-2xl font-medium mb-2">Identification Failed</h2>
        <p className="text-muted-foreground mb-6">
          {message || defaultMessage}
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
          <button 
            onClick={onTryAgain}
            className="bg-primary text-primary-foreground py-2 px-6 rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Try Again
          </button>
          <button 
            onClick={onBackToHome}
            className="bg-white text-primary border border-primary py-2 px-6 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
