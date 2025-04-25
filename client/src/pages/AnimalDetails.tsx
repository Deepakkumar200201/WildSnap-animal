import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { type AnimalDetails } from "@shared/schema";

export default function AnimalDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch animal details
  const { data: animalDetails, isLoading, error } = useQuery({
    queryKey: ["/api/animals", id],
    queryFn: async () => {
      const response = await fetch(`/api/animals/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch animal details");
      }
      return response.json() as Promise<AnimalDetails>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (error) {
    return (
      <div className="container py-16 max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-red-500">Error Loading Animal Details</h2>
        <p className="mt-4 text-gray-600 mb-6">
          Sorry, we couldn't load the animal details. Please try again.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => window.location.reload()}>Retry</Button>
          <Button variant="outline" onClick={() => setLocation("/animals")}>
            Back to Animals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setLocation("/animals")}>
            &larr; Back
          </Button>
          <h1 className="text-3xl font-bold">
            {isLoading ? <Skeleton className="h-9 w-64" /> : animalDetails?.animal.commonName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setLocation(`/add-animal-characteristics/${id}`)}
            disabled={isLoading}
          >
            Add Characteristics
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setLocation(`/add-animal-habitat/${id}`)}
            disabled={isLoading}
          >
            Add Habitat
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setLocation(`/add-animal-migration/${id}`)}
            disabled={isLoading}
          >
            Add Migration
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setLocation(`/add-animal-seasonal/${id}`)}
            disabled={isLoading}
          >
            Add Seasonal
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-64 w-full md:w-1/3 rounded-lg" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>
          <Skeleton className="h-12 w-full max-w-md" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : animalDetails ? (
        <>
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {animalDetails.animal.imageUrl && (
              <div className="md:w-1/3">
                <img
                  src={animalDetails.animal.imageUrl}
                  alt={animalDetails.animal.commonName}
                  className="w-full h-auto object-cover rounded-lg max-h-80"
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-medium text-gray-500 mb-1">
                {animalDetails.animal.scientificName}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {animalDetails.animal.animalClass}
                </span>
                {animalDetails.animal.animalOrder && (
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {animalDetails.animal.animalOrder}
                  </span>
                )}
                {animalDetails.animal.animalFamily && (
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {animalDetails.animal.animalFamily}
                  </span>
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-line mb-6">
                {animalDetails.animal.description}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-sm">
                  <span className="text-gray-500">Added:</span>{" "}
                  {new Date(animalDetails.animal.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Last updated:</span>{" "}
                  {new Date(animalDetails.animal.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="physical">Physical</TabsTrigger>
              <TabsTrigger value="habitat">Habitat</TabsTrigger>
              <TabsTrigger value="migration">Migration</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Physical Characteristics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {animalDetails.physicalCharacteristics.length === 0 ? (
                      <p className="text-gray-500">No physical characteristics added yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {animalDetails.physicalCharacteristics.map((char) => (
                          <li key={char.id} className="text-sm">
                            <span className="font-medium">Colors:</span> {char.colorPattern}
                            {char.size && (
                              <div>
                                <span className="font-medium">Size:</span> {char.size}
                              </div>
                            )}
                            {char.weight && (
                              <div>
                                <span className="font-medium">Weight:</span> {char.weight}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Habitat & Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {animalDetails.habitatRanges.length === 0 ? (
                      <p className="text-gray-500">No habitat information added yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {animalDetails.habitatRanges.map((habitat) => (
                          <li key={habitat.id} className="text-sm">
                            <div>
                              <span className="font-medium">Habitat:</span> {habitat.habitat}
                            </div>
                            <div>
                              <span className="font-medium">Continents:</span> {habitat.continents}
                            </div>
                            {habitat.countries && (
                              <div>
                                <span className="font-medium">Countries:</span> {habitat.countries}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Migration & Seasonal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {animalDetails.migrationPatterns.length === 0 ? (
                      <p className="text-gray-500">No migration information added yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {animalDetails.migrationPatterns.map((pattern) => (
                          <li key={pattern.id} className="text-sm">
                            <div>
                              <span className="font-medium">Type:</span> {pattern.migrationType}
                            </div>
                            {pattern.migrationDistance && (
                              <div>
                                <span className="font-medium">Distance:</span> {pattern.migrationDistance}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {animalDetails.seasonalAppearances.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2">Seasonal Appearances</h4>
                        <ul className="space-y-2">
                          {animalDetails.seasonalAppearances.map((appearance) => (
                            <li key={appearance.id} className="text-sm">
                              <div className="font-medium">{appearance.season}</div>
                              <div>{appearance.appearanceDescription}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="physical" className="pt-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Physical Characteristics</h2>
                <Button onClick={() => setLocation(`/add-animal-characteristics/${id}`)}>
                  Add Characteristics
                </Button>
              </div>

              {animalDetails.physicalCharacteristics.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-500 mb-2">No physical characteristics</h3>
                  <p className="text-gray-400 mb-6">
                    Add physical characteristics for this animal to provide more detailed information.
                  </p>
                  <Button onClick={() => setLocation(`/add-animal-characteristics/${id}`)}>
                    Add Characteristics
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {animalDetails.physicalCharacteristics.map((char) => (
                    <Card key={char.id}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {char.colorPattern && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Color Pattern</h4>
                              <p>{char.colorPattern}</p>
                            </div>
                          )}
                          {char.size && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Size</h4>
                              <p>{char.size}</p>
                            </div>
                          )}
                          {char.weight && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Weight</h4>
                              <p>{char.weight}</p>
                            </div>
                          )}
                          {char.bodyLength && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Body Length</h4>
                              <p>{char.bodyLength}</p>
                            </div>
                          )}
                          {char.limbs && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Limbs</h4>
                              <p>{char.limbs}</p>
                            </div>
                          )}
                          {char.specialFeatures && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Special Features</h4>
                              <p>{char.specialFeatures}</p>
                            </div>
                          )}
                          {char.lifespan && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Lifespan</h4>
                              <p>{char.lifespan}</p>
                            </div>
                          )}
                          {char.distinctiveFeatures && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Distinctive Features</h4>
                              <p>{char.distinctiveFeatures}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="habitat" className="pt-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Habitat & Range</h2>
                <Button onClick={() => setLocation(`/add-animal-habitat/${id}`)}>
                  Add Habitat
                </Button>
              </div>

              {animalDetails.habitatRanges.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-500 mb-2">No habitat information</h3>
                  <p className="text-gray-400 mb-6">
                    Add habitat and range information for this animal.
                  </p>
                  <Button onClick={() => setLocation(`/add-animal-habitat/${id}`)}>
                    Add Habitat
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {animalDetails.habitatRanges.map((habitat) => (
                    <Card key={habitat.id}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Primary Habitat</h4>
                              <p className="text-lg">{habitat.habitat}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Continents</h4>
                              <p>{habitat.continents}</p>
                            </div>
                            {habitat.countries && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Countries</h4>
                                <p>{habitat.countries}</p>
                              </div>
                            )}
                            {habitat.elevationRange && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Elevation Range</h4>
                                <p>{habitat.elevationRange}</p>
                              </div>
                            )}
                            {habitat.preferredEnvironment && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Preferred Environment</h4>
                                <p>{habitat.preferredEnvironment}</p>
                              </div>
                            )}
                            {habitat.temperature && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Temperature Range</h4>
                                <p>{habitat.temperature}</p>
                              </div>
                            )}
                            {habitat.vegetation && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Vegetation</h4>
                                <p>{habitat.vegetation}</p>
                              </div>
                            )}
                          </div>
                          {habitat.mapImageUrl && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">Range Map</h4>
                              <img
                                src={habitat.mapImageUrl}
                                alt={`${animalDetails.animal.commonName} range map`}
                                className="w-full h-auto object-contain rounded-md max-h-80"
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="migration" className="pt-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Migration & Seasonal Patterns</h2>
                <div className="flex gap-2">
                  <Button onClick={() => setLocation(`/add-animal-migration/${id}`)}>
                    Add Migration
                  </Button>
                  <Button onClick={() => setLocation(`/add-animal-seasonal/${id}`)}>
                    Add Seasonal
                  </Button>
                </div>
              </div>

              {animalDetails.migrationPatterns.length === 0 && animalDetails.seasonalAppearances.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-500 mb-2">No migration or seasonal information</h3>
                  <p className="text-gray-400 mb-6">
                    Add migration patterns and seasonal appearances for this animal.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => setLocation(`/add-animal-migration/${id}`)}>
                      Add Migration
                    </Button>
                    <Button variant="outline" onClick={() => setLocation(`/add-animal-seasonal/${id}`)}>
                      Add Seasonal
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {animalDetails.migrationPatterns.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Migration Patterns</h3>
                      <div className="space-y-6">
                        {animalDetails.migrationPatterns.map((pattern) => (
                          <Card key={pattern.id}>
                            <CardContent className="pt-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500">Migration Type</h4>
                                    <p className="text-lg">{pattern.migrationType}</p>
                                  </div>
                                  {pattern.breedingRange && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500">Breeding Range</h4>
                                      <p>{pattern.breedingRange}</p>
                                    </div>
                                  )}
                                  {pattern.nonBreedingRange && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500">Non-Breeding Range</h4>
                                      <p>{pattern.nonBreedingRange}</p>
                                    </div>
                                  )}
                                  {pattern.migrationSeasons && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500">Migration Seasons</h4>
                                      <p>{pattern.migrationSeasons}</p>
                                    </div>
                                  )}
                                  {pattern.migrationDistance && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500">Migration Distance</h4>
                                      <p>{pattern.migrationDistance}</p>
                                    </div>
                                  )}
                                  {pattern.migrationRoutes && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500">Migration Routes</h4>
                                      <p>{pattern.migrationRoutes}</p>
                                    </div>
                                  )}
                                  {pattern.stopoverSites && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500">Stopover Sites</h4>
                                      <p>{pattern.stopoverSites}</p>
                                    </div>
                                  )}
                                  {pattern.migrationTriggers && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500">Migration Triggers</h4>
                                      <p>{pattern.migrationTriggers}</p>
                                    </div>
                                  )}
                                </div>
                                {pattern.migrationMapUrl && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Migration Map</h4>
                                    <img
                                      src={pattern.migrationMapUrl}
                                      alt={`${animalDetails.animal.commonName} migration map`}
                                      className="w-full h-auto object-contain rounded-md max-h-80"
                                    />
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {animalDetails.seasonalAppearances.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Seasonal Appearances</h3>
                      <div className="space-y-6">
                        {animalDetails.seasonalAppearances.map((seasonal) => (
                          <Card key={seasonal.id}>
                            <CardContent className="pt-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500">Season</h4>
                                    <p className="text-lg">{seasonal.season}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                                    <p>{seasonal.appearanceDescription}</p>
                                  </div>
                                  {seasonal.behavioralChanges && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500">Behavioral Changes</h4>
                                      <p>{seasonal.behavioralChanges}</p>
                                    </div>
                                  )}
                                  {seasonal.seasonalLocation && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500">Location</h4>
                                      <p>{seasonal.seasonalLocation}</p>
                                    </div>
                                  )}
                                  {seasonal.seasonalDiet && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500">Diet</h4>
                                      <p>{seasonal.seasonalDiet}</p>
                                    </div>
                                  )}
                                  {seasonal.activityPattern && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500">Activity Pattern</h4>
                                      <p>{seasonal.activityPattern}</p>
                                    </div>
                                  )}
                                </div>
                                {seasonal.imageUrl && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Seasonal Image</h4>
                                    <img
                                      src={seasonal.imageUrl}
                                      alt={`${animalDetails.animal.commonName} in ${seasonal.season}`}
                                      className="w-full h-auto object-contain rounded-md max-h-80"
                                    />
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </div>
  );
}