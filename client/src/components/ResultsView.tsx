import React, { useState } from "react";
import type { AnimalIdentificationResult } from "@shared/schema";

interface ResultsViewProps {
  imageSrc: string;
  result: AnimalIdentificationResult;
  onBackToHome: () => void;
}

export default function ResultsView({ imageSrc, result, onBackToHome }: ResultsViewProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const { primaryResult, alternativeResults = [], facts = [] } = result;
  
  const handleFeedback = (isCorrect: boolean) => {
    setFeedback(isCorrect ? "Thank you for your feedback!" : "Thank you for your feedback! We'll improve our model.");
  };
  
  return (
    <div className="flex-grow flex flex-col pb-16">
      <div className="w-full mb-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-medium">Identification Results</h2>
          <button 
            onClick={onBackToHome}
            className="text-primary flex items-center"
          >
            <span className="mr-1"><i className="ri-arrow-left-line"></i></span>
            New Scan
          </button>
        </div>
        
        <div className="w-full rounded-lg overflow-hidden shadow-md">
          <img 
            src={imageSrc} 
            alt={primaryResult.name} 
            className="w-full object-contain bg-gray-100" 
            style={{ maxHeight: '400px' }}
          />
        </div>
      </div>
      
      {/* Primary result */}
      <div className="bg-white rounded-lg p-4 shadow-md mb-4 border-l-4 border-secondary">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-medium text-foreground">{primaryResult.name}</h3>
            {primaryResult.scientificName && (
              <p className="text-sm text-muted-foreground italic">{primaryResult.scientificName}</p>
            )}
          </div>
          <div className="bg-secondary text-white text-sm py-1 px-3 rounded-full">
            <span>{primaryResult.confidence}%</span>
          </div>
        </div>
        
        <div className="h-2 bg-gray-200 rounded-full mt-2">
          <div 
            className="h-full bg-secondary rounded-full" 
            style={{ width: `${primaryResult.confidence}%` }}
          ></div>
        </div>
      </div>
      
      {/* Alternative results */}
      {alternativeResults.length > 0 && (
        <>
          <h3 className="text-lg font-medium mt-4 mb-2">Other Possibilities</h3>
          
          <div className="space-y-3">
            {alternativeResults.map((alt, index) => (
              <div key={index} className="bg-white rounded-lg p-3 shadow-md flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-foreground">{alt.name}</h4>
                  {alt.scientificName && (
                    <p className="text-xs text-muted-foreground italic">{alt.scientificName}</p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>{alt.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Animal facts section */}
      {facts.length > 0 && (
        <div className="mt-6 bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <span className="text-primary mr-2"><i className="ri-information-line"></i></span>
            Quick Facts
          </h3>
          <div className="text-sm space-y-2">
            {facts.map((fact, index) => (
              <p key={index}>• {fact}</p>
            ))}
          </div>
        </div>
      )}
      
      {/* Feedback section */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-md">
        <h3 className="text-lg font-medium mb-2">Was this identification correct?</h3>
        
        {feedback ? (
          <p className="text-sm text-muted-foreground">{feedback}</p>
        ) : (
          <div className="flex space-x-3">
            <button 
              onClick={() => handleFeedback(true)}
              className="flex-1 py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <span className="mr-1"><i className="ri-thumb-up-line"></i></span> Yes
            </button>
            <button 
              onClick={() => handleFeedback(false)}
              className="flex-1 py-2 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <span className="mr-1"><i className="ri-thumb-down-line"></i></span> No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
