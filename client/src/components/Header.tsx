import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onHelpClick: () => void;
}

export default function Header({ onHelpClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-medium flex items-center">
          <span className="text-primary mr-2 text-2xl"><i className="ri-camera-lens-line"></i></span>
          AnimalID
        </h1>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <i className="ri-dashboard-line"></i>
              Dashboard
            </Button>
          </Link>
          <Link href="/birds">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <i className="ri-bird-fill"></i>
              Bird Database
            </Button>
          </Link>
          <button 
            onClick={onHelpClick}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Help"
          >
            <span className="text-muted-foreground text-xl"><i className="ri-question-line"></i></span>
          </button>
        </div>
      </div>
    </header>
  );
}
