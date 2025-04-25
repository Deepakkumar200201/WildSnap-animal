import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { fetchBirdDetails } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function BirdDetails() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const birdId = parseInt(id);

  const {
    data: birdDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["/api/birds", birdId],
    queryFn: () => fetchBirdDetails(birdId),
    enabled: !isNaN(birdId),
  });

  if (isNaN(birdId)) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Animal ID</h1>
        <Button onClick={() => navigate("/birds")}>
          Return to Animals List
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 w-1/3 mx-auto rounded mb-8"></div>
          <div className="h-6 bg-slate-200 w-1/2 mx-auto rounded mb-4"></div>
          <div className="h-6 bg-slate-200 w-1/4 mx-auto rounded mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !birdDetails) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Failed to load animal details
        </h1>
        <p className="mb-6 text-red-500">
          An error occurred while loading the animal information.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate("/birds")}>
            Return to Animal List
          </Button>
        </div>
      </div>
    );
  }

  const {
    bird,
    physicalCharacteristics,
    habitatRanges,
    migrationPatterns,
    seasonalAppearances,
  } = birdDetails;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <Link href="/birds">
            <Button variant="ghost" className="mb-2">
              &larr; Back to Birds
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
            {bird.commonName}
          </h1>
          <p className="text-xl italic text-slate-600 mb-2">
            {bird.scientificName}
          </p>
        </div>
      </div>

      {bird.imageUrl && (
        <div className="rounded-lg overflow-hidden mb-8 max-h-96">
          <img
            src={bird.imageUrl}
            alt={bird.commonName}
            className="w-full object-cover"
          />
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-slate-700 leading-relaxed">{bird.description}</p>
      </div>

      <Tabs defaultValue="physical" className="mb-12">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="physical">Physical Characteristics</TabsTrigger>
          <TabsTrigger value="habitat">Habitat & Range</TabsTrigger>
          <TabsTrigger value="migration">Migration Patterns</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="physical">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Physical Characteristics</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => navigate(`/birds/${birdId}/characteristics/add`)}
              >
                <PlusCircle className="h-4 w-4" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              {physicalCharacteristics.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 italic mb-4">
                    No physical characteristics information available yet.
                  </p>
                  <Button
                    onClick={() =>
                      navigate(`/birds/${birdId}/characteristics/add`)
                    }
                    className="bg-gradient-to-r from-blue-600 to-teal-400"
                  >
                    Add Physical Characteristics
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {physicalCharacteristics.map((pc) => (
                    <div key={pc.id} className="border rounded-md p-4">
                      <div className="grid grid-cols-[120px_1fr] gap-y-2">
                        {pc.size && (
                          <>
                            <span className="text-slate-500">Size:</span>
                            <span>{pc.size}</span>
                          </>
                        )}
                        {pc.weight && (
                          <>
                            <span className="text-slate-500">Weight:</span>
                            <span>{pc.weight}</span>
                          </>
                        )}
                        {pc.wingspan && (
                          <>
                            <span className="text-slate-500">Wingspan:</span>
                            <span>{pc.wingspan}</span>
                          </>
                        )}
                        {pc.plumageColor && (
                          <>
                            <span className="text-slate-500">Plumage:</span>
                            <span>{pc.plumageColor}</span>
                          </>
                        )}
                        {pc.billShape && (
                          <>
                            <span className="text-slate-500">Bill:</span>
                            <span>{pc.billShape}</span>
                          </>
                        )}
                        {pc.legColor && (
                          <>
                            <span className="text-slate-500">Legs:</span>
                            <span>{pc.legColor}</span>
                          </>
                        )}
                        {pc.eyeColor && (
                          <>
                            <span className="text-slate-500">Eyes:</span>
                            <span>{pc.eyeColor}</span>
                          </>
                        )}
                        {pc.distinctiveFeatures && (
                          <>
                            <span className="text-slate-500">Distinctive:</span>
                            <span>{pc.distinctiveFeatures}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habitat">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Habitat & Range Information</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => navigate(`/birds/${birdId}/habitat/add`)}
              >
                <PlusCircle className="h-4 w-4" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              {habitatRanges.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 italic mb-4">
                    No habitat and range information available yet.
                  </p>
                  <Button
                    onClick={() => navigate(`/birds/${birdId}/habitat/add`)}
                    className="bg-gradient-to-r from-blue-600 to-teal-400"
                  >
                    Add Habitat & Range Information
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {habitatRanges.map((hr) => (
                    <div key={hr.id} className="border rounded-md p-6">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="font-medium text-lg mb-2">
                            Habitat Information
                          </h3>
                          <div className="grid grid-cols-[120px_1fr] gap-y-3">
                            <span className="text-slate-500">Habitat:</span>
                            <span>{hr.habitat}</span>

                            {hr.continents && (
                              <>
                                <span className="text-slate-500">
                                  Continents:
                                </span>
                                <span>{hr.continents}</span>
                              </>
                            )}

                            {hr.countries && (
                              <>
                                <span className="text-slate-500">
                                  Countries:
                                </span>
                                <span>{hr.countries}</span>
                              </>
                            )}

                            {hr.elevationRange && (
                              <>
                                <span className="text-slate-500">
                                  Elevation:
                                </span>
                                <span>{hr.elevationRange}</span>
                              </>
                            )}

                            {hr.preferredEnvironment && (
                              <>
                                <span className="text-slate-500">
                                  Environment:
                                </span>
                                <span>{hr.preferredEnvironment}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {hr.mapImageUrl && (
                          <div>
                            <h3 className="font-medium text-lg mb-2">
                              Range Map
                            </h3>
                            <div className="border rounded overflow-hidden">
                              <img
                                src={hr.mapImageUrl}
                                alt="Range map"
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="migration">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Migration Patterns</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => navigate(`/birds/${birdId}/migration/add`)}
              >
                <PlusCircle className="h-4 w-4" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              {migrationPatterns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 italic mb-4">
                    No migration pattern information available yet.
                  </p>
                  <Button
                    onClick={() => navigate(`/birds/${birdId}/migration/add`)}
                    className="bg-gradient-to-r from-blue-600 to-teal-400"
                  >
                    Add Migration Pattern
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {migrationPatterns.map((mp) => (
                    <div key={mp.id} className="border rounded-md p-6">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="font-medium text-lg mb-2">
                            Migration Information
                          </h3>
                          <div className="grid grid-cols-[140px_1fr] gap-y-3">
                            <span className="text-slate-500">
                              Migration Type:
                            </span>
                            <span>{mp.migrationType}</span>

                            {mp.breedingRange && (
                              <>
                                <span className="text-slate-500">
                                  Breeding Range:
                                </span>
                                <span>{mp.breedingRange}</span>
                              </>
                            )}

                            {mp.winteringRange && (
                              <>
                                <span className="text-slate-500">
                                  Wintering Range:
                                </span>
                                <span>{mp.winteringRange}</span>
                              </>
                            )}

                            {mp.migrationSeasons && (
                              <>
                                <span className="text-slate-500">Seasons:</span>
                                <span>{mp.migrationSeasons}</span>
                              </>
                            )}

                            {mp.migrationRoutes && (
                              <>
                                <span className="text-slate-500">Routes:</span>
                                <span>{mp.migrationRoutes}</span>
                              </>
                            )}

                            {mp.stopoverSites && (
                              <>
                                <span className="text-slate-500">
                                  Stopover Sites:
                                </span>
                                <span>{mp.stopoverSites}</span>
                              </>
                            )}

                            {mp.migrationDistance && (
                              <>
                                <span className="text-slate-500">
                                  Distance:
                                </span>
                                <span>{mp.migrationDistance}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {mp.migrationMapUrl && (
                          <div>
                            <h3 className="font-medium text-lg mb-2">
                              Migration Route Map
                            </h3>
                            <div className="border rounded overflow-hidden">
                              <img
                                src={mp.migrationMapUrl}
                                alt="Migration route map"
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Seasonal Appearance</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => navigate(`/birds/${birdId}/seasonal/add`)}
              >
                <PlusCircle className="h-4 w-4" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              {seasonalAppearances.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 italic mb-4">
                    No seasonal appearance information available yet.
                  </p>
                  <Button
                    onClick={() => navigate(`/birds/${birdId}/seasonal/add`)}
                    className="bg-gradient-to-r from-blue-600 to-teal-400"
                  >
                    Add Seasonal Appearance
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {seasonalAppearances.map((sa) => (
                    <div key={sa.id} className="border rounded-md p-6">
                      <h3 className="text-lg font-medium mb-3">{sa.season}</h3>

                      <div className="mb-4">
                        <h4 className="text-sm text-slate-500 mb-1">Plumage</h4>
                        <p>{sa.plumageDescription}</p>
                      </div>

                      {sa.behavioralChanges && (
                        <div className="mb-4">
                          <h4 className="text-sm text-slate-500 mb-1">
                            Behavioral Changes
                          </h4>
                          <p>{sa.behavioralChanges}</p>
                        </div>
                      )}

                      {sa.seasonalLocation && (
                        <div className="mb-4">
                          <h4 className="text-sm text-slate-500 mb-1">
                            Location
                          </h4>
                          <p>{sa.seasonalLocation}</p>
                        </div>
                      )}

                      {sa.seasonalDiet && (
                        <div className="mb-4">
                          <h4 className="text-sm text-slate-500 mb-1">Diet</h4>
                          <p>{sa.seasonalDiet}</p>
                        </div>
                      )}

                      {sa.imageUrl && (
                        <div className="mt-4">
                          <div className="border rounded overflow-hidden">
                            <img
                              src={sa.imageUrl}
                              alt={`${bird.commonName} in ${sa.season}`}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
