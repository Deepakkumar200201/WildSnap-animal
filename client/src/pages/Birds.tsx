import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { fetchBirds, searchBirds } from "@/lib/api";
import type { Bird } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Birds() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse");

  // Query to fetch birds list
  const birdsQuery = useQuery({
    queryKey: ["/api/birds"],
    enabled: activeTab === "browse",
    queryFn: () => fetchBirds(),
  });

  // Query for bird search
  const searchQueryResult = useQuery({
    queryKey: ["/api/birds/search", searchQuery],
    enabled: !!searchQuery && activeTab === "search",
    queryFn: () => searchBirds(searchQuery),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab("search");
    }
  };

  const renderBirdCard = (bird: Bird) => (
    <Card key={bird.id} className="overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{bird.commonName}</CardTitle>
        <CardDescription className="italic text-sm">
          {bird.scientificName}
        </CardDescription>
      </CardHeader>
      {bird.imageUrl && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={bird.imageUrl}
            alt={bird.commonName}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardContent className="p-4">
        <p className="text-sm line-clamp-3">{bird.description}</p>
      </CardContent>
      <CardFooter className="border-t p-4 flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/birds/${bird.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );

  const isLoading =
    (activeTab === "browse" && birdsQuery.isLoading) ||
    (activeTab === "search" && searchQueryResult.isLoading);

  const hasError =
    (activeTab === "browse" && birdsQuery.isError) ||
    (activeTab === "search" && searchQueryResult.isError);

  const birds =
    activeTab === "browse"
      ? birdsQuery.data || []
      : searchQueryResult.data || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
            Animal Database
          </h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/birds/add")}
              className="bg-gradient-to-r from-blue-600 to-teal-400"
            >
              Add New Animail
            </Button>
            <Link href="/">
              <Button variant="outline">Return to Identification</Button>
            </Link>
          </div>
        </div>
        <p className="text-slate-600 max-w-2xl mb-4">
          Explore our comprehensive database of birds with detailed information
          about physical characteristics, habitat, migration patterns, and
          seasonal appearance.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mb-4">
          <Input
            type="text"
            placeholder="Search birds by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="browse">Browse All</TabsTrigger>
          <TabsTrigger value="search" disabled={!searchQuery.trim()}>
            Search Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="pt-4">
          <h2 className="text-2xl font-semibold mb-4">Browse Animal</h2>
        </TabsContent>

        <TabsContent value="search" className="pt-4">
          <h2 className="text-2xl font-semibold mb-4">
            Search Results for "{searchQuery}"
          </h2>
        </TabsContent>
      </Tabs>

      {isLoading ? (
        <div className="grid place-items-center py-12">
          <div className="animate-pulse text-center">
            <div className="h-8 w-64 mx-auto bg-slate-200 rounded mb-4"></div>
            <div className="h-4 w-48 mx-auto bg-slate-200 rounded"></div>
          </div>
        </div>
      ) : hasError ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Failed to load animal information</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : birds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">
            {activeTab === "search"
              ? `No birds matching "${searchQuery}" found`
              : "No birds in the database yet"}
          </p>
          <Button
            onClick={() => navigate("/birds/add")}
            className="bg-gradient-to-r from-blue-600 to-teal-400"
          >
            Add a New Animal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {birds.map(renderBirdCard)}
        </div>
      )}
    </div>
  );
}
