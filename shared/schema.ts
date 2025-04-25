import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Animal identification schema
export const identifications = pgTable("identifications", {
  id: serial("id").primaryKey(),
  imagePath: text("image_path").notNull(),
  primaryAnimal: text("primary_animal").notNull(),
  scientificName: text("scientific_name"),
  confidence: integer("confidence").notNull(),
  alternativeResults: text("alternative_results"), // JSON string of alternatives
  facts: text("facts"), // JSON string of facts
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertIdentificationSchema = createInsertSchema(identifications).pick({
  imagePath: true,
  primaryAnimal: true,
  scientificName: true,
  confidence: true,
  alternativeResults: true,
  facts: true,
});

export type InsertIdentification = z.infer<typeof insertIdentificationSchema>;
export type Identification = typeof identifications.$inferSelect;

// Schema for Gemini API response
export const animalIdentificationResultSchema = z.object({
  primaryResult: z.object({
    name: z.string(),
    scientificName: z.string().optional(),
    confidence: z.number(),
  }),
  alternativeResults: z.array(
    z.object({
      name: z.string(),
      scientificName: z.string().optional(),
      confidence: z.number(),
    })
  ).optional(),
  facts: z.array(z.string()).optional(),
});

export type AnimalIdentificationResult = z.infer<typeof animalIdentificationResultSchema>;

// Bird database schema
export const birds = pgTable("birds", {
  id: serial("id").primaryKey(),
  commonName: text("common_name").notNull().unique(),
  scientificName: text("scientific_name").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const birdsRelations = relations(birds, ({ many }) => ({
  physicalCharacteristics: many(birdPhysicalCharacteristics),
  habitatRanges: many(birdHabitatRanges),
  migrationPatterns: many(birdMigrationPatterns),
  seasonalAppearances: many(birdSeasonalAppearances),
}));

export const birdPhysicalCharacteristics = pgTable("bird_physical_characteristics", {
  id: serial("id").primaryKey(),
  birdId: integer("bird_id").notNull().references(() => birds.id, { onDelete: 'cascade' }),
  size: text("size"), // e.g., "Small (15-20cm)", "Medium (25-35cm)"
  weight: text("weight"), // e.g., "15-30g", "250-350g"
  wingspan: text("wingspan"), // e.g., "30-40cm", "1.2-1.5m"
  plumageColor: text("plumage_color").notNull(), // e.g., "Red head, brown body"
  billShape: text("bill_shape"), // e.g., "Long and pointed", "Short and conical"
  legColor: text("leg_color"), // e.g., "Yellow", "Black"
  eyeColor: text("eye_color"), // e.g., "Red", "Yellow"
  distinctiveFeatures: text("distinctive_features"), // e.g., "Crest on head", "White-tipped tail"
});

export const birdPhysicalCharacteristicsRelations = relations(birdPhysicalCharacteristics, ({ one }) => ({
  bird: one(birds, {
    fields: [birdPhysicalCharacteristics.birdId],
    references: [birds.id],
  }),
}));

export const birdHabitatRanges = pgTable("bird_habitat_ranges", {
  id: serial("id").primaryKey(),
  birdId: integer("bird_id").notNull().references(() => birds.id, { onDelete: 'cascade' }),
  habitat: text("habitat").notNull(), // e.g., "Forest", "Wetland", "Urban"
  continents: text("continents").notNull(), // e.g., "North America, Europe"
  countries: text("countries"), // e.g., "USA, Canada, Mexico"
  elevationRange: text("elevation_range"), // e.g., "0-500m", "1000-3000m"
  mapImageUrl: text("map_image_url"), // URL to the range map image
  preferredEnvironment: text("preferred_environment"), // e.g., "Near water bodies", "Dense forests"
});

export const birdHabitatRangesRelations = relations(birdHabitatRanges, ({ one }) => ({
  bird: one(birds, {
    fields: [birdHabitatRanges.birdId],
    references: [birds.id],
  }),
}));

export const birdMigrationPatterns = pgTable("bird_migration_patterns", {
  id: serial("id").primaryKey(),
  birdId: integer("bird_id").notNull().references(() => birds.id, { onDelete: 'cascade' }),
  migrationType: text("migration_type").notNull(), // e.g., "Full migrant", "Partial migrant", "Resident"
  breedingRange: text("breeding_range"), // e.g., "Northern Europe"
  winteringRange: text("wintering_range"), // e.g., "Central Africa"
  migrationSeasons: text("migration_seasons"), // e.g., "March-April, September-October"
  migrationRoutes: text("migration_routes"), // e.g., "Eastern Atlantic", "Mississippi Flyway"
  stopoverSites: text("stopover_sites"), // e.g., "Great Lakes", "Mediterranean coast"
  migrationDistance: text("migration_distance"), // e.g., "Up to 10,000 km"
  migrationMapUrl: text("migration_map_url"), // URL to migration route map
});

export const birdMigrationPatternsRelations = relations(birdMigrationPatterns, ({ one }) => ({
  bird: one(birds, {
    fields: [birdMigrationPatterns.birdId],
    references: [birds.id],
  }),
}));

export const birdSeasonalAppearances = pgTable("bird_seasonal_appearances", {
  id: serial("id").primaryKey(),
  birdId: integer("bird_id").notNull().references(() => birds.id, { onDelete: 'cascade' }),
  season: text("season").notNull(), // e.g., "Spring", "Summer", "Fall", "Winter"
  plumageDescription: text("plumage_description").notNull(), // e.g., "Bright breeding colors", "Dull winter plumage"
  behavioralChanges: text("behavioral_changes"), // e.g., "More vocal", "Forms large flocks"
  seasonalLocation: text("seasonal_location"), // e.g., "Coastal areas", "Inland forests"
  seasonalDiet: text("seasonal_diet"), // e.g., "Primarily insects", "Seeds and berries"
  imageUrl: text("image_url"), // URL to image showing seasonal appearance
});

export const birdSeasonalAppearancesRelations = relations(birdSeasonalAppearances, ({ one }) => ({
  bird: one(birds, {
    fields: [birdSeasonalAppearances.birdId],
    references: [birds.id],
  }),
}));

// Insert schemas for birds
export const insertBirdSchema = createInsertSchema(birds).pick({
  commonName: true,
  scientificName: true,
  description: true,
  imageUrl: true,
});

export const insertBirdPhysicalCharacteristicsSchema = createInsertSchema(birdPhysicalCharacteristics).pick({
  birdId: true,
  size: true,
  weight: true,
  wingspan: true,
  plumageColor: true,
  billShape: true,
  legColor: true,
  eyeColor: true,
  distinctiveFeatures: true,
});

export const insertBirdHabitatRangesSchema = createInsertSchema(birdHabitatRanges).pick({
  birdId: true,
  habitat: true,
  continents: true,
  countries: true,
  elevationRange: true,
  mapImageUrl: true,
  preferredEnvironment: true,
});

export const insertBirdMigrationPatternsSchema = createInsertSchema(birdMigrationPatterns).pick({
  birdId: true,
  migrationType: true,
  breedingRange: true,
  winteringRange: true,
  migrationSeasons: true,
  migrationRoutes: true,
  stopoverSites: true,
  migrationDistance: true,
  migrationMapUrl: true,
});

export const insertBirdSeasonalAppearancesSchema = createInsertSchema(birdSeasonalAppearances).pick({
  birdId: true,
  season: true,
  plumageDescription: true,
  behavioralChanges: true,
  seasonalLocation: true,
  seasonalDiet: true,
  imageUrl: true,
});

// Types for birds
export type InsertBird = z.infer<typeof insertBirdSchema>;
export type Bird = typeof birds.$inferSelect;

export type InsertBirdPhysicalCharacteristics = z.infer<typeof insertBirdPhysicalCharacteristicsSchema>;
export type BirdPhysicalCharacteristics = typeof birdPhysicalCharacteristics.$inferSelect;

export type InsertBirdHabitatRange = z.infer<typeof insertBirdHabitatRangesSchema>;
export type BirdHabitatRange = typeof birdHabitatRanges.$inferSelect;

export type InsertBirdMigrationPattern = z.infer<typeof insertBirdMigrationPatternsSchema>;
export type BirdMigrationPattern = typeof birdMigrationPatterns.$inferSelect;

export type InsertBirdSeasonalAppearance = z.infer<typeof insertBirdSeasonalAppearancesSchema>;
export type BirdSeasonalAppearance = typeof birdSeasonalAppearances.$inferSelect;

// Schema for bird details with all related information
export const birdDetailsSchema = z.object({
  bird: z.object({
    id: z.number(),
    commonName: z.string(),
    scientificName: z.string(),
    description: z.string(),
    imageUrl: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  physicalCharacteristics: z.array(z.object({
    id: z.number(),
    birdId: z.number(),
    size: z.string().optional().nullable(),
    weight: z.string().optional().nullable(),
    wingspan: z.string().optional().nullable(),
    plumageColor: z.string(),
    billShape: z.string().optional().nullable(),
    legColor: z.string().optional().nullable(),
    eyeColor: z.string().optional().nullable(),
    distinctiveFeatures: z.string().optional().nullable(),
  })),
  habitatRanges: z.array(z.object({
    id: z.number(),
    birdId: z.number(),
    habitat: z.string(),
    continents: z.string(),
    countries: z.string().optional().nullable(),
    elevationRange: z.string().optional().nullable(),
    mapImageUrl: z.string().optional().nullable(),
    preferredEnvironment: z.string().optional().nullable(),
  })),
  migrationPatterns: z.array(z.object({
    id: z.number(),
    birdId: z.number(),
    migrationType: z.string(),
    breedingRange: z.string().optional().nullable(),
    winteringRange: z.string().optional().nullable(),
    migrationSeasons: z.string().optional().nullable(),
    migrationRoutes: z.string().optional().nullable(),
    stopoverSites: z.string().optional().nullable(),
    migrationDistance: z.string().optional().nullable(),
    migrationMapUrl: z.string().optional().nullable(),
  })),
  seasonalAppearances: z.array(z.object({
    id: z.number(),
    birdId: z.number(),
    season: z.string(),
    plumageDescription: z.string(),
    behavioralChanges: z.string().optional().nullable(),
    seasonalLocation: z.string().optional().nullable(),
    seasonalDiet: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
  })),
});

export type BirdDetails = z.infer<typeof birdDetailsSchema>;

// Animal database schema (general for all animals)
export const animals = pgTable("animals", {
  id: serial("id").primaryKey(),
  commonName: text("common_name").notNull().unique(),
  scientificName: text("scientific_name").notNull().unique(),
  description: text("description").notNull(),
  animalClass: text("animal_class").notNull(), // Mammal, Bird, Reptile, Amphibian, Fish, etc.
  animalOrder: text("animal_order"),
  animalFamily: text("animal_family"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const animalsRelations = relations(animals, ({ many }) => ({
  physicalCharacteristics: many(animalPhysicalCharacteristics),
  habitatRanges: many(animalHabitatRanges),
  migrationPatterns: many(animalMigrationPatterns),
  seasonalAppearances: many(animalSeasonalAppearances),
}));

export const animalPhysicalCharacteristics = pgTable("animal_physical_characteristics", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id").notNull().references(() => animals.id, { onDelete: "cascade" }),
  size: text("size"),
  weight: text("weight"),
  bodyLength: text("body_length"),
  colorPattern: text("color_pattern").notNull(),
  limbs: text("limbs"),
  specialFeatures: text("special_features"),
  lifespan: text("lifespan"),
  distinctiveFeatures: text("distinctive_features"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const animalPhysicalCharacteristicsRelations = relations(animalPhysicalCharacteristics, ({ one }) => ({
  animal: one(animals, { fields: [animalPhysicalCharacteristics.animalId], references: [animals.id] }),
}));

export const animalHabitatRanges = pgTable("animal_habitat_ranges", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id").notNull().references(() => animals.id, { onDelete: "cascade" }),
  habitat: text("habitat").notNull(),
  continents: text("continents").notNull(),
  countries: text("countries"),
  elevationRange: text("elevation_range"),
  preferredEnvironment: text("preferred_environment"),
  mapImageUrl: text("map_image_url"),
  temperature: text("temperature_range"),
  vegetation: text("vegetation_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const animalHabitatRangesRelations = relations(animalHabitatRanges, ({ one }) => ({
  animal: one(animals, { fields: [animalHabitatRanges.animalId], references: [animals.id] }),
}));

export const animalMigrationPatterns = pgTable("animal_migration_patterns", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id").notNull().references(() => animals.id, { onDelete: "cascade" }),
  migrationType: text("migration_type").notNull(),
  breedingRange: text("breeding_range"),
  nonBreedingRange: text("non_breeding_range"),
  migrationSeasons: text("migration_seasons"),
  migrationRoutes: text("migration_routes"),
  stopoverSites: text("stopover_sites"),
  migrationDistance: text("migration_distance"),
  migrationMapUrl: text("migration_map_url"),
  migrationTriggers: text("migration_triggers"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const animalMigrationPatternsRelations = relations(animalMigrationPatterns, ({ one }) => ({
  animal: one(animals, { fields: [animalMigrationPatterns.animalId], references: [animals.id] }),
}));

export const animalSeasonalAppearances = pgTable("animal_seasonal_appearances", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id").notNull().references(() => animals.id, { onDelete: "cascade" }),
  season: text("season").notNull(),
  appearanceDescription: text("appearance_description").notNull(),
  behavioralChanges: text("behavioral_changes"),
  seasonalLocation: text("seasonal_location"),
  seasonalDiet: text("seasonal_diet"),
  activityPattern: text("activity_pattern"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const animalSeasonalAppearancesRelations = relations(animalSeasonalAppearances, ({ one }) => ({
  animal: one(animals, { fields: [animalSeasonalAppearances.animalId], references: [animals.id] }),
}));

// Insert schemas for animals
export const insertAnimalSchema = createInsertSchema(animals).pick({
  commonName: true,
  scientificName: true,
  description: true,
  animalClass: true,
  animalOrder: true,
  animalFamily: true,
  imageUrl: true,
});

export const insertAnimalPhysicalCharacteristicsSchema = createInsertSchema(animalPhysicalCharacteristics).pick({
  animalId: true,
  size: true,
  weight: true,
  bodyLength: true,
  colorPattern: true,
  limbs: true,
  specialFeatures: true,
  lifespan: true,
  distinctiveFeatures: true,
});

export const insertAnimalHabitatRangesSchema = createInsertSchema(animalHabitatRanges).pick({
  animalId: true,
  habitat: true,
  continents: true,
  countries: true,
  elevationRange: true,
  preferredEnvironment: true,
  mapImageUrl: true,
  temperature: true,
  vegetation: true,
});

export const insertAnimalMigrationPatternsSchema = createInsertSchema(animalMigrationPatterns).pick({
  animalId: true,
  migrationType: true,
  breedingRange: true,
  nonBreedingRange: true,
  migrationSeasons: true,
  migrationRoutes: true,
  stopoverSites: true,
  migrationDistance: true,
  migrationMapUrl: true,
  migrationTriggers: true,
});

export const insertAnimalSeasonalAppearancesSchema = createInsertSchema(animalSeasonalAppearances).pick({
  animalId: true,
  season: true,
  appearanceDescription: true,
  behavioralChanges: true,
  seasonalLocation: true,
  seasonalDiet: true,
  activityPattern: true,
  imageUrl: true,
});

// Types for animals
export type InsertAnimal = z.infer<typeof insertAnimalSchema>;
export type Animal = typeof animals.$inferSelect;

export type InsertAnimalPhysicalCharacteristics = z.infer<typeof insertAnimalPhysicalCharacteristicsSchema>;
export type AnimalPhysicalCharacteristics = typeof animalPhysicalCharacteristics.$inferSelect;

export type InsertAnimalHabitatRange = z.infer<typeof insertAnimalHabitatRangesSchema>;
export type AnimalHabitatRange = typeof animalHabitatRanges.$inferSelect;

export type InsertAnimalMigrationPattern = z.infer<typeof insertAnimalMigrationPatternsSchema>;
export type AnimalMigrationPattern = typeof animalMigrationPatterns.$inferSelect;

export type InsertAnimalSeasonalAppearance = z.infer<typeof insertAnimalSeasonalAppearancesSchema>;
export type AnimalSeasonalAppearance = typeof animalSeasonalAppearances.$inferSelect;

// Schema for animal details with all related information
export const animalDetailsSchema = z.object({
  animal: z.object({
    id: z.number(),
    commonName: z.string(),
    scientificName: z.string(),
    description: z.string(),
    animalClass: z.string(),
    animalOrder: z.string().optional().nullable(),
    animalFamily: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  physicalCharacteristics: z.array(z.object({
    id: z.number(),
    animalId: z.number(),
    size: z.string().optional().nullable(),
    weight: z.string().optional().nullable(),
    bodyLength: z.string().optional().nullable(),
    colorPattern: z.string(),
    limbs: z.string().optional().nullable(),
    specialFeatures: z.string().optional().nullable(),
    lifespan: z.string().optional().nullable(),
    distinctiveFeatures: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })),
  habitatRanges: z.array(z.object({
    id: z.number(),
    animalId: z.number(),
    habitat: z.string(),
    continents: z.string(),
    countries: z.string().optional().nullable(),
    elevationRange: z.string().optional().nullable(),
    preferredEnvironment: z.string().optional().nullable(),
    mapImageUrl: z.string().optional().nullable(),
    temperature: z.string().optional().nullable(),
    vegetation: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })),
  migrationPatterns: z.array(z.object({
    id: z.number(),
    animalId: z.number(),
    migrationType: z.string(),
    breedingRange: z.string().optional().nullable(),
    nonBreedingRange: z.string().optional().nullable(),
    migrationSeasons: z.string().optional().nullable(),
    migrationRoutes: z.string().optional().nullable(),
    stopoverSites: z.string().optional().nullable(),
    migrationDistance: z.string().optional().nullable(),
    migrationMapUrl: z.string().optional().nullable(),
    migrationTriggers: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })),
  seasonalAppearances: z.array(z.object({
    id: z.number(),
    animalId: z.number(),
    season: z.string(),
    appearanceDescription: z.string(),
    behavioralChanges: z.string().optional().nullable(),
    seasonalLocation: z.string().optional().nullable(),
    seasonalDiet: z.string().optional().nullable(),
    activityPattern: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })),
});

export type AnimalDetails = z.infer<typeof animalDetailsSchema>;
