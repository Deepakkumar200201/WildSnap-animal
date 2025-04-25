import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  animalIdentificationResultSchema, 
  insertBirdSchema, 
  insertBirdPhysicalCharacteristicsSchema,
  insertBirdHabitatRangesSchema,
  insertBirdMigrationPatternsSchema,
  insertBirdSeasonalAppearancesSchema,
  insertAnimalSchema,
  insertAnimalPhysicalCharacteristicsSchema,
  insertAnimalHabitatRangesSchema,
  insertAnimalMigrationPatternsSchema,
  insertAnimalSeasonalAppearancesSchema
} from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Animal Database Endpoints
  app.get("/api/animals", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const animals = await storage.listAnimals(limit, offset);
      res.json(animals);
    } catch (error) {
      console.error("Error fetching animals:", error);
      res.status(500).json({ message: "Failed to fetch animals" });
    }
  });

  app.get("/api/animals/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.json([]);
      }
      const animals = await storage.searchAnimals(query);
      res.json(animals);
    } catch (error) {
      console.error("Error searching animals:", error);
      res.status(500).json({ message: "Failed to search animals" });
    }
  });

  app.get("/api/animals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid animal ID" });
      }
      
      const animalDetails = await storage.getAnimalDetails(id);
      if (!animalDetails) {
        return res.status(404).json({ message: "Animal not found" });
      }
      
      res.json(animalDetails);
    } catch (error) {
      console.error("Error fetching animal details:", error);
      res.status(500).json({ message: "Failed to fetch animal details" });
    }
  });

  app.post("/api/animals", async (req: Request, res: Response) => {
    try {
      const animalData = insertAnimalSchema.parse(req.body);
      const animal = await storage.createAnimal(animalData);
      res.status(201).json(animal);
    } catch (error) {
      console.error("Error creating animal:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid animal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create animal" });
    }
  });

  app.post("/api/animals/:id/physical-characteristics", async (req: Request, res: Response) => {
    try {
      const animalId = parseInt(req.params.id);
      if (isNaN(animalId)) {
        return res.status(400).json({ message: "Invalid animal ID" });
      }
      
      const data = insertAnimalPhysicalCharacteristicsSchema.parse({
        ...req.body,
        animalId
      });
      
      const characteristics = await storage.addAnimalPhysicalCharacteristics(data);
      res.status(201).json(characteristics);
    } catch (error) {
      console.error("Error adding physical characteristics:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add physical characteristics" });
    }
  });

  app.post("/api/animals/:id/habitat-ranges", async (req: Request, res: Response) => {
    try {
      const animalId = parseInt(req.params.id);
      if (isNaN(animalId)) {
        return res.status(400).json({ message: "Invalid animal ID" });
      }
      
      const data = insertAnimalHabitatRangesSchema.parse({
        ...req.body,
        animalId
      });
      
      const habitatRange = await storage.addAnimalHabitatRange(data);
      res.status(201).json(habitatRange);
    } catch (error) {
      console.error("Error adding habitat range:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add habitat range" });
    }
  });

  app.post("/api/animals/:id/migration-patterns", async (req: Request, res: Response) => {
    try {
      const animalId = parseInt(req.params.id);
      if (isNaN(animalId)) {
        return res.status(400).json({ message: "Invalid animal ID" });
      }
      
      const data = insertAnimalMigrationPatternsSchema.parse({
        ...req.body,
        animalId
      });
      
      const migrationPattern = await storage.addAnimalMigrationPattern(data);
      res.status(201).json(migrationPattern);
    } catch (error) {
      console.error("Error adding migration pattern:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add migration pattern" });
    }
  });

  app.post("/api/animals/:id/seasonal-appearances", async (req: Request, res: Response) => {
    try {
      const animalId = parseInt(req.params.id);
      if (isNaN(animalId)) {
        return res.status(400).json({ message: "Invalid animal ID" });
      }
      
      const data = insertAnimalSeasonalAppearancesSchema.parse({
        ...req.body,
        animalId
      });
      
      const seasonalAppearance = await storage.addAnimalSeasonalAppearance(data);
      res.status(201).json(seasonalAppearance);
    } catch (error) {
      console.error("Error adding seasonal appearance:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add seasonal appearance" });
    }
  });
  
  // Original endpoints start here
  // Initialize the Google Generative AI client
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  app.get("/api/identifications/recent", async (req, res) => {
    try {
      const recentIdentifications = await storage.getRecentIdentifications();
      res.json(recentIdentifications);
    } catch (error) {
      console.error("Error fetching recent identifications:", error);
      res.status(500).json({ message: "Failed to fetch recent identifications" });
    }
  });

  app.get("/api/identifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const identification = await storage.getIdentification(id);
      
      if (!identification) {
        return res.status(404).json({ message: "Identification not found" });
      }
      
      res.json(identification);
    } catch (error) {
      console.error("Error fetching identification:", error);
      res.status(500).json({ message: "Failed to fetch identification" });
    }
  });

  app.post("/api/identify", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Convert the image to base64
      const imageBase64 = req.file.buffer.toString("base64");
      const mimeType = req.file.mimetype;

      // Prepare the prompt for Gemini
      const prompt = "Identify the animal in this image. Provide the following information in a JSON format:\n" +
        "1. The primary animal species with its common name\n" +
        "2. The scientific name (if applicable)\n" +
        "3. A confidence score between 0-100\n" +
        "4. Up to 3 alternative possibilities with their confidence scores\n" +
        "5. 5 short interesting facts about the primary animal\n\n" +
        "Ensure the response is in valid JSON format with this structure:\n" +
        '{\n  "primaryResult": {"name": "Common Name", "scientificName": "Scientific Name", "confidence": 95},\n' +
        '  "alternativeResults": [\n    {"name": "Alt Animal 1", "scientificName": "Alt Scientific 1", "confidence": 15},\n' +
        '    {"name": "Alt Animal 2", "scientificName": "Alt Scientific 2", "confidence": 10},\n' +
        '    {"name": "Alt Animal 3", "scientificName": "Alt Scientific 3", "confidence": 5}\n  ],\n' +
        '  "facts": ["Fact 1", "Fact 2", "Fact 3", "Fact 4", "Fact 5"]\n}';

      // Generate content with Gemini
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType,
            data: imageBase64
          }
        }
      ]);

      const response = await result.response;
      const responseText = response.text().trim();
      
      // Extract JSON from the response (sometimes Gemini wraps JSON in markdown code blocks)
      let jsonStr = responseText;
      if (responseText.includes("```json")) {
        jsonStr = responseText.split("```json")[1].split("```")[0].trim();
      } else if (responseText.includes("```")) {
        jsonStr = responseText.split("```")[1].split("```")[0].trim();
      }

      // Parse and validate the JSON response
      const jsonResponse = JSON.parse(jsonStr);
      const validatedResponse = animalIdentificationResultSchema.parse(jsonResponse);

      // Store the identification in memory storage
      const identification = await storage.createIdentification({
        imagePath: `data:${mimeType};base64,${imageBase64}`,
        primaryAnimal: validatedResponse.primaryResult.name,
        scientificName: validatedResponse.primaryResult.scientificName || "",
        confidence: validatedResponse.primaryResult.confidence,
        alternativeResults: JSON.stringify(validatedResponse.alternativeResults || []),
        facts: JSON.stringify(validatedResponse.facts || []),
      });

      res.json({
        id: identification.id,
        result: validatedResponse
      });
    } catch (error) {
      console.error("Error identifying animal:", error);
      res.status(500).json({ 
        message: "Failed to identify animal",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Bird Database API Routes
  
  // Get all birds (paginated)
  app.get("/api/birds", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const birds = await storage.listBirds(limit, offset);
      res.json(birds);
    } catch (error) {
      console.error("Error fetching birds:", error);
      res.status(500).json({ message: "Failed to fetch birds" });
    }
  });
  
  // Search birds by name
  app.get("/api/birds/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const birds = await storage.searchBirds(query);
      res.json(birds);
    } catch (error) {
      console.error("Error searching birds:", error);
      res.status(500).json({ message: "Failed to search birds" });
    }
  });
  
  // Get bird by ID with all details
  app.get("/api/birds/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const birdDetails = await storage.getBirdDetails(id);
      
      if (!birdDetails) {
        return res.status(404).json({ message: "Bird not found" });
      }
      
      res.json(birdDetails);
    } catch (error) {
      console.error("Error fetching bird details:", error);
      res.status(500).json({ message: "Failed to fetch bird details" });
    }
  });
  
  // Create a new bird
  app.post("/api/birds", async (req: Request, res: Response) => {
    try {
      const birdData = insertBirdSchema.parse(req.body);
      const bird = await storage.createBird(birdData);
      res.status(201).json(bird);
    } catch (error) {
      console.error("Error creating bird:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid bird data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create bird" });
    }
  });

  // Add physical characteristics to a bird
  app.post("/api/birds/:id/physical-characteristics", async (req: Request, res: Response) => {
    try {
      const birdId = parseInt(req.params.id);
      
      // Check if bird exists
      const bird = await storage.getBird(birdId);
      if (!bird) {
        return res.status(404).json({ message: "Bird not found" });
      }
      
      const characteristicsData = insertBirdPhysicalCharacteristicsSchema.parse({
        ...req.body,
        birdId
      });
      
      const characteristics = await storage.addBirdPhysicalCharacteristics(characteristicsData);
      res.status(201).json(characteristics);
    } catch (error) {
      console.error("Error adding physical characteristics:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add physical characteristics" });
    }
  });
  
  // Add habitat range to a bird
  app.post("/api/birds/:id/habitat-ranges", async (req: Request, res: Response) => {
    try {
      const birdId = parseInt(req.params.id);
      
      // Check if bird exists
      const bird = await storage.getBird(birdId);
      if (!bird) {
        return res.status(404).json({ message: "Bird not found" });
      }
      
      const habitatRangeData = insertBirdHabitatRangesSchema.parse({
        ...req.body,
        birdId
      });
      
      const habitatRange = await storage.addBirdHabitatRange(habitatRangeData);
      res.status(201).json(habitatRange);
    } catch (error) {
      console.error("Error adding habitat range:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add habitat range" });
    }
  });
  
  // Add migration pattern to a bird
  app.post("/api/birds/:id/migration-patterns", async (req: Request, res: Response) => {
    try {
      const birdId = parseInt(req.params.id);
      
      // Check if bird exists
      const bird = await storage.getBird(birdId);
      if (!bird) {
        return res.status(404).json({ message: "Bird not found" });
      }
      
      const migrationPatternData = insertBirdMigrationPatternsSchema.parse({
        ...req.body,
        birdId
      });
      
      const migrationPattern = await storage.addBirdMigrationPattern(migrationPatternData);
      res.status(201).json(migrationPattern);
    } catch (error) {
      console.error("Error adding migration pattern:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add migration pattern" });
    }
  });
  
  // Add seasonal appearance to a bird
  app.post("/api/birds/:id/seasonal-appearances", async (req: Request, res: Response) => {
    try {
      const birdId = parseInt(req.params.id);
      
      // Check if bird exists
      const bird = await storage.getBird(birdId);
      if (!bird) {
        return res.status(404).json({ message: "Bird not found" });
      }
      
      const seasonalAppearanceData = insertBirdSeasonalAppearancesSchema.parse({
        ...req.body,
        birdId
      });
      
      const seasonalAppearance = await storage.addBirdSeasonalAppearance(seasonalAppearanceData);
      res.status(201).json(seasonalAppearance);
    } catch (error) {
      console.error("Error adding seasonal appearance:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add seasonal appearance" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
