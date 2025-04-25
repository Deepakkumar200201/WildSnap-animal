import React, { useEffect } from "react";

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.id === 'help-modal-overlay') onClose();
    };

    window.addEventListener('keydown', handleEscKey);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      id="help-modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in"
    >
      <div className="bg-white rounded-lg w-full max-w-md mx-4 animate-in slide-in-from-bottom-10 duration-300">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">How to Use AnimalID</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <span className="text-xl"><i className="ri-close-line"></i></span>
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="flex items-start">
            <div className="mr-3 mt-1 text-primary text-xl">
              <i className="ri-camera-line"></i>
            </div>
            <div>
              <h4 className="font-medium mb-1">Take a Photo</h4>
              <p className="text-sm text-muted-foreground">Use your device's camera to capture a clear photo of the animal.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-3 mt-1 text-primary text-xl">
              <i className="ri-upload-2-line"></i>
            </div>
            <div>
              <h4 className="font-medium mb-1">Upload an Image</h4>
              <p className="text-sm text-muted-foreground">Select an existing photo from your device's gallery.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-3 mt-1 text-primary text-xl">
              <i className="ri-ai-generate"></i>
            </div>
            <div>
              <h4 className="font-medium mb-1">AI Identification</h4>
              <p className="text-sm text-muted-foreground">Gemini AI analyzes the image to identify the animal species.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-3 mt-1 text-primary text-xl">
              <i className="ri-information-line"></i>
            </div>
            <div>
              <h4 className="font-medium mb-1">Review Results</h4>
              <p className="text-sm text-muted-foreground">See identification details, confidence levels, and facts about the animal.</p>
            </div>
          </div>
        </div>
        
        <div className="p-5 border-t border-gray-200">
          <p className="text-sm text-muted-foreground mb-3">Tips for best results:</p>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
            <li>Ensure the animal is clearly visible</li>
            <li>Good lighting improves identification accuracy</li>
            <li>Try to capture the animal's distinctive features</li>
            <li>Avoid motion blur by holding your device steady</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
