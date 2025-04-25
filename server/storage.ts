import { 
  identifications, 
  type Identification, 
  type InsertIdentification,
  users, 
  type User, 
  type InsertUser,
  birds,
  type Bird,
  type InsertBird,
  birdPhysicalCharacteristics,
  type BirdPhysicalCharacteristics,
  type InsertBirdPhysicalCharacteristics,
  birdHabitatRanges,
  type BirdHabitatRange,
  type InsertBirdHabitatRange,
  birdMigrationPatterns,
  type BirdMigrationPattern,
  type InsertBirdMigrationPattern,
  birdSeasonalAppearances,
  type BirdSeasonalAppearance,
  type InsertBirdSeasonalAppearance,
  type BirdDetails,
  animals,
  type Animal,
  type InsertAnimal,
  animalPhysicalCharacteristics,
  type AnimalPhysicalCharacteristics,
  type InsertAnimalPhysicalCharacteristics,
  animalHabitatRanges,
  type AnimalHabitatRange,
  type InsertAnimalHabitatRange,
  animalMigrationPatterns,
  type AnimalMigrationPattern,
  type InsertAnimalMigrationPattern,
  animalSeasonalAppearances,
  type AnimalSeasonalAppearance,
  type InsertAnimalSeasonalAppearance,
  type AnimalDetails
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Animal identification operations
  createIdentification(identification: InsertIdentification): Promise<Identification>;
  getRecentIdentifications(limit?: number): Promise<Identification[]>;
  getIdentification(id: number): Promise<Identification | undefined>;
  
  // Bird database operations
  createBird(bird: InsertBird): Promise<Bird>;
  getBird(id: number): Promise<Bird | undefined>;
  getBirdByName(commonName: string): Promise<Bird | undefined>;
  listBirds(limit?: number, offset?: number): Promise<Bird[]>;
  searchBirds(query: string): Promise<Bird[]>;
  
  // Bird physical characteristics operations
  addBirdPhysicalCharacteristics(characteristics: InsertBirdPhysicalCharacteristics): Promise<BirdPhysicalCharacteristics>;
  getBirdPhysicalCharacteristics(birdId: number): Promise<BirdPhysicalCharacteristics[]>;
  
  // Bird habitat range operations
  addBirdHabitatRange(habitatRange: InsertBirdHabitatRange): Promise<BirdHabitatRange>;
  getBirdHabitatRanges(birdId: number): Promise<BirdHabitatRange[]>;
  
  // Bird migration pattern operations
  addBirdMigrationPattern(migrationPattern: InsertBirdMigrationPattern): Promise<BirdMigrationPattern>;
  getBirdMigrationPatterns(birdId: number): Promise<BirdMigrationPattern[]>;
  
  // Bird seasonal appearance operations
  addBirdSeasonalAppearance(seasonalAppearance: InsertBirdSeasonalAppearance): Promise<BirdSeasonalAppearance>;
  getBirdSeasonalAppearances(birdId: number): Promise<BirdSeasonalAppearance[]>;
  
  // Get complete bird details including all related data
  getBirdDetails(birdId: number): Promise<BirdDetails | undefined>;
  
  // Animal database operations
  createAnimal(animal: InsertAnimal): Promise<Animal>;
  getAnimal(id: number): Promise<Animal | undefined>;
  getAnimalByName(commonName: string): Promise<Animal | undefined>;
  listAnimals(limit?: number, offset?: number): Promise<Animal[]>;
  searchAnimals(query: string): Promise<Animal[]>;
  
  // Animal physical characteristics operations
  addAnimalPhysicalCharacteristics(characteristics: InsertAnimalPhysicalCharacteristics): Promise<AnimalPhysicalCharacteristics>;
  getAnimalPhysicalCharacteristics(animalId: number): Promise<AnimalPhysicalCharacteristics[]>;
  
  // Animal habitat range operations
  addAnimalHabitatRange(habitatRange: InsertAnimalHabitatRange): Promise<AnimalHabitatRange>;
  getAnimalHabitatRanges(animalId: number): Promise<AnimalHabitatRange[]>;
  
  // Animal migration pattern operations
  addAnimalMigrationPattern(migrationPattern: InsertAnimalMigrationPattern): Promise<AnimalMigrationPattern>;
  getAnimalMigrationPatterns(animalId: number): Promise<AnimalMigrationPattern[]>;
  
  // Animal seasonal appearance operations
  addAnimalSeasonalAppearance(seasonalAppearance: InsertAnimalSeasonalAppearance): Promise<AnimalSeasonalAppearance>;
  getAnimalSeasonalAppearances(animalId: number): Promise<AnimalSeasonalAppearance[]>;
  
  // Get complete animal details including all related data
  getAnimalDetails(animalId: number): Promise<AnimalDetails | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Animal identification operations
  async createIdentification(insertIdentification: InsertIdentification): Promise<Identification> {
    const [identification] = await db.insert(identifications).values({
      ...insertIdentification,
      // Ensure null values instead of undefined
      scientificName: insertIdentification.scientificName || null,
      alternativeResults: insertIdentification.alternativeResults || null,
      facts: insertIdentification.facts || null,
    }).returning();
    return identification;
  }

  async getRecentIdentifications(limit: number = 3): Promise<Identification[]> {
    return await db.select().from(identifications).orderBy(desc(identifications.timestamp)).limit(limit);
  }

  async getIdentification(id: number): Promise<Identification | undefined> {
    const [identification] = await db.select().from(identifications).where(eq(identifications.id, id));
    return identification;
  }

  // Bird database operations
  async createBird(bird: InsertBird): Promise<Bird> {
    const [newBird] = await db.insert(birds).values(bird).returning();
    return newBird;
  }

  async getBird(id: number): Promise<Bird | undefined> {
    const [bird] = await db.select().from(birds).where(eq(birds.id, id));
    return bird;
  }

  async getBirdByName(commonName: string): Promise<Bird | undefined> {
    const [bird] = await db.select().from(birds).where(eq(birds.commonName, commonName));
    return bird;
  }

  async listBirds(limit: number = 50, offset: number = 0): Promise<Bird[]> {
    return await db.select().from(birds)
      .orderBy(asc(birds.commonName))
      .limit(limit)
      .offset(offset);
  }

  async searchBirds(query: string): Promise<Bird[]> {
    // Use like operation for search
    const likePattern = `%${query}%`;
    
    // First get all birds
    const allBirds = await db.select().from(birds).orderBy(asc(birds.commonName));
    
    // Filter birds in memory based on case-insensitive matching
    const lowerQuery = query.toLowerCase();
    const filteredBirds = allBirds.filter(bird => 
      bird.commonName.toLowerCase().includes(lowerQuery) || 
      bird.scientificName.toLowerCase().includes(lowerQuery)
    );
    
    return filteredBirds.slice(0, 50); // Limit to 50 results
  }

  // Bird physical characteristics operations
  async addBirdPhysicalCharacteristics(characteristics: InsertBirdPhysicalCharacteristics): Promise<BirdPhysicalCharacteristics> {
    const [newCharacteristics] = await db.insert(birdPhysicalCharacteristics).values(characteristics).returning();
    return newCharacteristics;
  }

  async getBirdPhysicalCharacteristics(birdId: number): Promise<BirdPhysicalCharacteristics[]> {
    return await db.select().from(birdPhysicalCharacteristics).where(eq(birdPhysicalCharacteristics.birdId, birdId));
  }

  // Bird habitat range operations
  async addBirdHabitatRange(habitatRange: InsertBirdHabitatRange): Promise<BirdHabitatRange> {
    const [newHabitatRange] = await db.insert(birdHabitatRanges).values(habitatRange).returning();
    return newHabitatRange;
  }

  async getBirdHabitatRanges(birdId: number): Promise<BirdHabitatRange[]> {
    return await db.select().from(birdHabitatRanges).where(eq(birdHabitatRanges.birdId, birdId));
  }

  // Bird migration pattern operations
  async addBirdMigrationPattern(migrationPattern: InsertBirdMigrationPattern): Promise<BirdMigrationPattern> {
    const [newMigrationPattern] = await db.insert(birdMigrationPatterns).values(migrationPattern).returning();
    return newMigrationPattern;
  }

  async getBirdMigrationPatterns(birdId: number): Promise<BirdMigrationPattern[]> {
    return await db.select().from(birdMigrationPatterns).where(eq(birdMigrationPatterns.birdId, birdId));
  }

  // Bird seasonal appearance operations
  async addBirdSeasonalAppearance(seasonalAppearance: InsertBirdSeasonalAppearance): Promise<BirdSeasonalAppearance> {
    const [newSeasonalAppearance] = await db.insert(birdSeasonalAppearances).values(seasonalAppearance).returning();
    return newSeasonalAppearance;
  }

  async getBirdSeasonalAppearances(birdId: number): Promise<BirdSeasonalAppearance[]> {
    return await db.select().from(birdSeasonalAppearances).where(eq(birdSeasonalAppearances.birdId, birdId));
  }

  // Get complete bird details including all related data
  async getBirdDetails(birdId: number): Promise<BirdDetails | undefined> {
    const [bird] = await db.select().from(birds).where(eq(birds.id, birdId));
    
    if (!bird) {
      return undefined;
    }
    
    const physicalCharacteristics = await this.getBirdPhysicalCharacteristics(birdId);
    const habitatRanges = await this.getBirdHabitatRanges(birdId);
    const migrationPatterns = await this.getBirdMigrationPatterns(birdId);
    const seasonalAppearances = await this.getBirdSeasonalAppearances(birdId);
    
    return {
      bird,
      physicalCharacteristics,
      habitatRanges,
      migrationPatterns,
      seasonalAppearances
    };
  }
  
  // Animal database operations
  async createAnimal(animal: InsertAnimal): Promise<Animal> {
    const [newAnimal] = await db.insert(animals).values(animal).returning();
    return newAnimal;
  }

  async getAnimal(id: number): Promise<Animal | undefined> {
    const [animal] = await db.select().from(animals).where(eq(animals.id, id));
    return animal;
  }

  async getAnimalByName(commonName: string): Promise<Animal | undefined> {
    const [animal] = await db.select().from(animals).where(eq(animals.commonName, commonName));
    return animal;
  }

  async listAnimals(limit: number = 50, offset: number = 0): Promise<Animal[]> {
    return await db.select().from(animals)
      .orderBy(asc(animals.commonName))
      .limit(limit)
      .offset(offset);
  }

  async searchAnimals(query: string): Promise<Animal[]> {
    // Get all animals
    const allAnimals = await db.select().from(animals).orderBy(asc(animals.commonName));
    
    // Filter animals in memory based on case-insensitive matching
    const lowerQuery = query.toLowerCase();
    const filteredAnimals = allAnimals.filter(animal => 
      animal.commonName.toLowerCase().includes(lowerQuery) || 
      animal.scientificName.toLowerCase().includes(lowerQuery)
    );
    
    return filteredAnimals.slice(0, 50); // Limit to 50 results
  }

  // Animal physical characteristics operations
  async addAnimalPhysicalCharacteristics(characteristics: InsertAnimalPhysicalCharacteristics): Promise<AnimalPhysicalCharacteristics> {
    const [newCharacteristics] = await db.insert(animalPhysicalCharacteristics).values(characteristics).returning();
    return newCharacteristics;
  }

  async getAnimalPhysicalCharacteristics(animalId: number): Promise<AnimalPhysicalCharacteristics[]> {
    return await db.select().from(animalPhysicalCharacteristics).where(eq(animalPhysicalCharacteristics.animalId, animalId));
  }

  // Animal habitat range operations
  async addAnimalHabitatRange(habitatRange: InsertAnimalHabitatRange): Promise<AnimalHabitatRange> {
    const [newHabitatRange] = await db.insert(animalHabitatRanges).values(habitatRange).returning();
    return newHabitatRange;
  }

  async getAnimalHabitatRanges(animalId: number): Promise<AnimalHabitatRange[]> {
    return await db.select().from(animalHabitatRanges).where(eq(animalHabitatRanges.animalId, animalId));
  }

  // Animal migration pattern operations
  async addAnimalMigrationPattern(migrationPattern: InsertAnimalMigrationPattern): Promise<AnimalMigrationPattern> {
    const [newMigrationPattern] = await db.insert(animalMigrationPatterns).values(migrationPattern).returning();
    return newMigrationPattern;
  }

  async getAnimalMigrationPatterns(animalId: number): Promise<AnimalMigrationPattern[]> {
    return await db.select().from(animalMigrationPatterns).where(eq(animalMigrationPatterns.animalId, animalId));
  }

  // Animal seasonal appearance operations
  async addAnimalSeasonalAppearance(seasonalAppearance: InsertAnimalSeasonalAppearance): Promise<AnimalSeasonalAppearance> {
    const [newSeasonalAppearance] = await db.insert(animalSeasonalAppearances).values(seasonalAppearance).returning();
    return newSeasonalAppearance;
  }

  async getAnimalSeasonalAppearances(animalId: number): Promise<AnimalSeasonalAppearance[]> {
    return await db.select().from(animalSeasonalAppearances).where(eq(animalSeasonalAppearances.animalId, animalId));
  }

  // Get complete animal details including all related data
  async getAnimalDetails(animalId: number): Promise<AnimalDetails | undefined> {
    const [animal] = await db.select().from(animals).where(eq(animals.id, animalId));
    
    if (!animal) {
      return undefined;
    }
    
    const physicalCharacteristics = await this.getAnimalPhysicalCharacteristics(animalId);
    const habitatRanges = await this.getAnimalHabitatRanges(animalId);
    const migrationPatterns = await this.getAnimalMigrationPatterns(animalId);
    const seasonalAppearances = await this.getAnimalSeasonalAppearances(animalId);
    
    return {
      animal,
      physicalCharacteristics,
      habitatRanges,
      migrationPatterns,
      seasonalAppearances
    };
  }
}

// Use the DatabaseStorage now that we have a PostgreSQL database
export const storage = new DatabaseStorage();