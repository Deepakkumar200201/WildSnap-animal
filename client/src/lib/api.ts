import { apiRequest } from "./queryClient";
import type { 
  AnimalIdentificationResult, 
  Bird, 
  BirdDetails, 
  BirdPhysicalCharacteristics,
  BirdHabitatRange,
  BirdMigrationPattern,
  BirdSeasonalAppearance,
  InsertBird,
  InsertBirdPhysicalCharacteristics,
  InsertBirdHabitatRange,
  InsertBirdMigrationPattern,
  InsertBirdSeasonalAppearance
} from "@shared/schema";

export interface IdentificationResponse {
  id: number;
  result: AnimalIdentificationResult;
}

export async function identifyAnimal(imageFile: File): Promise<IdentificationResponse> {
  const formData = new FormData();
  formData.append("image", imageFile);
  
  const response = await fetch("/api/identify", {
    method: "POST",
    body: formData,
    credentials: "include"
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to identify animal: ${response.status} ${errorText}`);
  }
  
  return response.json();
}

export async function fetchRecentIdentifications() {
  const response = await apiRequest("GET", "/api/identifications/recent");
  return response.json();
}

export async function fetchIdentification(id: number) {
  const response = await apiRequest("GET", `/api/identifications/${id}`);
  return response.json();
}

// Bird Database API Functions

// Fetch list of birds (paginated)
export async function fetchBirds(limit: number = 50, offset: number = 0): Promise<Bird[]> {
  const response = await apiRequest("GET", `/api/birds?limit=${limit}&offset=${offset}`);
  return response.json();
}

// Search birds by name
export async function searchBirds(query: string): Promise<Bird[]> {
  const response = await apiRequest("GET", `/api/birds/search?q=${encodeURIComponent(query)}`);
  return response.json();
}

// Get bird details by ID
export async function fetchBirdDetails(id: number): Promise<BirdDetails> {
  const response = await apiRequest("GET", `/api/birds/${id}`);
  return response.json();
}

// Create a new bird
export async function createBird(birdData: InsertBird): Promise<Bird> {
  const response = await apiRequest("POST", "/api/birds", {
    body: JSON.stringify(birdData),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.json();
}

// Add physical characteristics to a bird
export async function addBirdPhysicalCharacteristics(
  birdId: number,
  data: Omit<InsertBirdPhysicalCharacteristics, "birdId">
): Promise<BirdPhysicalCharacteristics> {
  const response = await apiRequest("POST", `/api/birds/${birdId}/physical-characteristics`, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.json();
}

// Add habitat range to a bird
export async function addBirdHabitatRange(
  birdId: number,
  data: Omit<InsertBirdHabitatRange, "birdId">
): Promise<BirdHabitatRange> {
  const response = await apiRequest("POST", `/api/birds/${birdId}/habitat-ranges`, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.json();
}

// Add migration pattern to a bird
export async function addBirdMigrationPattern(
  birdId: number,
  data: Omit<InsertBirdMigrationPattern, "birdId">
): Promise<BirdMigrationPattern> {
  const response = await apiRequest("POST", `/api/birds/${birdId}/migration-patterns`, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.json();
}

// Add seasonal appearance to a bird
export async function addBirdSeasonalAppearance(
  birdId: number,
  data: Omit<InsertBirdSeasonalAppearance, "birdId">
): Promise<BirdSeasonalAppearance> {
  const response = await apiRequest("POST", `/api/birds/${birdId}/seasonal-appearances`, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.json();
}
