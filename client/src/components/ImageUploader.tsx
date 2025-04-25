import React, { useRef } from "react";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if the file is an image
      if (file.type.startsWith('image/')) {
        onImageSelected(file);
      } else {
        alert('Please select an image file (JPEG, PNG)');
      }
      
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      <input 
        ref={fileInputRef}
        type="file" 
        id="file-input" 
        accept="image/*" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleFileChange}
        aria-label="Upload Image"
      />
      <button className="w-full bg-white text-primary border border-primary py-3 px-6 rounded-lg font-medium flex items-center justify-center hover:bg-gray-50 transition shadow-md">
        <span className="mr-2"><i className="ri-upload-2-line"></i></span>
        Upload Image
      </button>
    </div>
  );
}
