import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Animal } from "@shared/schema";

export default function Animals() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Function to fetch all animals with optional search query
  const fetchAnimals = async (): Promise<Animal[]> => {
    const endpoint = searchQuery 
      ? `/api/animals/search?q=${encodeURIComponent(searchQuery)}` 
      : "/api/animals";
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error("Failed to fetch animals");
    }
    
    return response.json();
  };

  // Use React Query to fetch animals
  const { data: animals, isLoading, error, refetch } = useQuery({
    queryKey: ["animals", searchQuery],
    queryFn: fetchAnimals,
  });

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Refetch when search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, refetch]);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Animal Database</h1>
        <Button onClick={() => setLocation("/add-animal")}>
          <span className="mr-2">+</span> Add New Animal
        </Button>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search animals by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-lg"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          Error loading animals. Please try again.
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-40 mb-1" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full rounded-md mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Animals grid */}
      {!isLoading && animals && (
        <>
          {animals.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-500 mb-2">No animals found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "The database is empty. Add your first animal to get started."}
              </p>
              {!searchQuery && (
                <Button onClick={() => setLocation("/add-animal")}>
                  Add Animal
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animals.map((animal) => (
                <Link key={animal.id} href={`/animals/${animal.id}`}>
                  <a className="block transition-transform hover:scale-105">
                    <Card className="h-full overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{animal.commonName}</CardTitle>
                        <CardDescription className="italic">
                          {animal.scientificName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {animal.imageUrl && (
                          <div className="w-full h-40 mb-3 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={animal.imageUrl}
                              alt={animal.commonName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {animal.description.substring(0, 120)}
                          {animal.description.length > 120 ? "..." : ""}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <span className="text-sm text-gray-500">
                          Class: {animal.animalClass}
                        </span>
                        <span className="text-sm font-medium text-primary">
                          View Details →
                        </span>
                      </CardFooter>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}