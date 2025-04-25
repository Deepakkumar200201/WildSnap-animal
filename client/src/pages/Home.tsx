import { useState } from "react";
import Header from "@/components/Header";
import Camera from "@/components/Camera";
import ImageUploader from "@/components/ImageUploader";
import LoadingView from "@/components/LoadingView";
import ResultsView from "@/components/ResultsView";
import ErrorView from "@/components/ErrorView";
import HelpModal from "@/components/HelpModal";
import { identifyAnimal } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { AnimalIdentificationResult } from "@shared/schema";

// View types for the application
type View = "intro" | "camera" | "loading" | "results" | "error";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("intro");
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [identificationResult, setIdentificationResult] = useState<AnimalIdentificationResult | null>(null);
  
  // Fetch recent identifications
  const { data: recentIdentifications = [] } = useQuery({
    queryKey: ["/api/identifications/recent"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleTakePhoto = () => {
    setCurrentView("camera");
  };

  const handleImageSelected = async (imageFile: File) => {
    try {
      setSelectedImage(URL.createObjectURL(imageFile));
      setCurrentView("loading");
      
      const response = await identifyAnimal(imageFile);
      setIdentificationResult(response.result);
      setCurrentView("results");
    } catch (error) {
      console.error("Identification error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to identify animal");
      setCurrentView("error");
    }
  };

  const handleCapturedImage = async (imageBlob: Blob) => {
    try {
      const imageFile = new File([imageBlob], "captured-image.jpg", { type: "image/jpeg" });
      setSelectedImage(URL.createObjectURL(imageFile));
      setCurrentView("loading");
      
      const response = await identifyAnimal(imageFile);
      setIdentificationResult(response.result);
      setCurrentView("results");
    } catch (error) {
      console.error("Identification error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to identify animal");
      setCurrentView("error");
    }
  };

  const handleRetry = () => {
    setCurrentView("intro");
  };

  const handleCloseCamera = () => {
    setCurrentView("intro");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onHelpClick={() => setIsHelpModalOpen(true)} />
      
      <main className="flex-grow container mx-auto px-4 py-6 flex flex-col">
        {currentView === "intro" && (
          <div className="flex-grow flex flex-col items-center justify-center py-8 fade-in">
            <div className="mb-8 text-center">
              <div className="inline-block p-4 bg-primary bg-opacity-10 rounded-full mb-4">
                <span className="text-primary text-4xl"><i className="ri-camera-line"></i></span>
              </div>
              <h2 className="text-2xl font-medium mb-2">Identify Any Animal</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Take a photo or upload an image to instantly identify animals using advanced AI.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
              <button 
                onClick={handleTakePhoto}
                className="bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium flex items-center justify-center hover:bg-primary/90 transition shadow-md"
              >
                <span className="mr-2"><i className="ri-camera-line"></i></span>
                Take Photo
              </button>
              
              <ImageUploader onImageSelected={handleImageSelected} />
            </div>
            
            {recentIdentifications.length > 0 && (
              <div className="mt-12 w-full max-w-lg">
                <h3 className="text-lg font-medium mb-4 text-center">Previously Identified</h3>
                <div className="grid grid-cols-3 gap-3">
                  {recentIdentifications.map((item: any) => (
                    <div key={item.id} className="aspect-square rounded-lg overflow-hidden shadow-md relative group">
                      <img src={item.imagePath} alt={item.primaryAnimal} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                        {item.primaryAnimal}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {currentView === "camera" && (
          <Camera 
            onCapture={handleCapturedImage} 
            onClose={handleCloseCamera} 
          />
        )}
        
        {currentView === "loading" && (
          <LoadingView imageSrc={selectedImage || ""} />
        )}
        
        {currentView === "results" && identificationResult && (
          <ResultsView 
            imageSrc={selectedImage || ""} 
            result={identificationResult}
            onBackToHome={handleRetry}
          />
        )}
        
        {currentView === "error" && (
          <ErrorView 
            message={errorMessage} 
            onTryAgain={handleRetry} 
            onBackToHome={handleRetry}
          />
        )}
      </main>
      
      {isHelpModalOpen && (
        <HelpModal onClose={() => setIsHelpModalOpen(false)} />
      )}
    </div>
  );
}
