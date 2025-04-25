import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { fetchBirds } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Feather,
  MapPin,
  Bird as BirdsIcon,
  Music,
  Plus,
  Search,
  BarChart2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch bird data
  const {
    data: birds,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["/api/birds"],
    queryFn: () => fetchBirds(),
  });

  // Mock data for demonstration purposes
  const stats = {
    totalBirds: birds?.length || 0,
    speciesWithSounds: 0,
    speciesWithMigration: 0,
    pendingIdentifications: 2,
  };

  const recentActivity = [
    {
      id: 1,
      action: "Added new bird",
      name: "American Robin",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Updated habitat info",
      name: "Blue Jay",
      time: "5 hours ago",
    },
    {
      id: 3,
      action: "Added migration pattern",
      name: "Canada Goose",
      time: "Yesterday",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
            Animal Database Dashboard
          </h1>
          <p className="text-slate-600 mt-1">
            Manage and analyze your animal database
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/birds/add")}
            className="bg-gradient-to-r from-blue-600 to-teal-400"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Animal
          </Button>
          <Link href="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <BirdsIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Animal</p>
                <h3 className="text-2xl font-bold">{stats.totalBirds}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-full">
                <Music className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">With Sound Data</p>
                <h3 className="text-2xl font-bold">
                  {stats.speciesWithSounds}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-100 rounded-full">
                <MapPin className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">With Migration Data</p>
                <h3 className="text-2xl font-bold">
                  {stats.speciesWithMigration}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pending IDs</p>
                <h3 className="text-2xl font-bold">
                  {stats.pendingIdentifications}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates to the animal database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-3 border-b pb-3 last:border-0"
                  >
                    <div className="text-blue-500">
                      <BirdsIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-slate-500">
                        <span className="font-medium text-slate-700">
                          {item.name}
                        </span>{" "}
                        • {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/birds/add")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Animal
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/birds")}
                >
                  <BirdsIcon className="mr-2 h-4 w-4" />
                  Browse Animals
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("physical")}
                >
                  <Feather className="mr-2 h-4 w-4" />
                  Physical Characteristics
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("habitat")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Habitats and Migration
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("sounds")}
                >
                  <Music className="mr-2 h-4 w-4" />
                  Sound Library
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="sounds">Sounds</TabsTrigger>
          <TabsTrigger value="habitat">Habitat</TabsTrigger>
          <TabsTrigger value="migration">Migration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Database Overview</CardTitle>
              <CardDescription>
                Summary of your animal database contents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Animal Species Distribution
                  </h3>
                  <div className="h-64 bg-slate-100 rounded flex items-center justify-center">
                    <BarChart2 className="h-10 w-10 text-slate-400" />
                    <span className="ml-2 text-slate-500">
                      Chart visualization would appear here
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Database Completeness
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Physical Characteristics
                        </span>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Habitat Information
                        </span>
                        <span className="text-sm font-medium">60%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Sound Recordings
                        </span>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-amber-500 rounded-full"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Migration Patterns
                        </span>
                        <span className="text-sm font-medium">40%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-2 bg-purple-500 rounded-full"
                          style={{ width: "40%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  Recent Animal Additions
                </h3>
                {isLoading ? (
                  <div className="text-center py-6">
                    <p className="text-slate-500">Loading animal data...</p>
                  </div>
                ) : isError ? (
                  <div className="text-center py-6">
                    <p className="text-red-500">Error loading animal data</p>
                  </div>
                ) : birds?.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-slate-500">
                      No animal in the database yet
                    </p>
                    <Button
                      className="mt-2 bg-gradient-to-r from-blue-600 to-teal-400"
                      onClick={() => navigate("/birds/add")}
                    >
                      Add Your First Animal
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {birds?.slice(0, 3).map((bird) => (
                      <Card key={bird.id} className="overflow-hidden">
                        {bird.imageUrl && (
                          <div className="h-32 overflow-hidden">
                            <img
                              src={bird.imageUrl}
                              alt={bird.commonName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h4 className="font-medium">{bird.commonName}</h4>
                          <p className="text-sm text-slate-500 italic">
                            {bird.scientificName}
                          </p>
                          <Button
                            variant="link"
                            className="p-0 h-auto mt-2"
                            onClick={() => navigate(`/birds/${bird.id}`)}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="physical">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Physical Characteristics</CardTitle>
                <CardDescription>
                  Manage physical attributes of birds in the database
                </CardDescription>
              </div>
              <Button onClick={() => navigate("/birds/add")}>
                <Plus className="mr-2 h-4 w-4" /> Add Animal
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex-1">
                  <Input placeholder="Search by name, feature, color..." />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colors</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">Loading bird data...</p>
                </div>
              ) : isError ? (
                <div className="text-center py-12">
                  <p className="text-red-500">Error loading animal data</p>
                </div>
              ) : birds?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">
                    No animals in the database yet
                  </p>
                  <Button
                    className="mt-2 bg-gradient-to-r from-blue-600 to-teal-400"
                    onClick={() => navigate("/birds/add")}
                  >
                    Add Your First animal
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {birds?.map((bird) => (
                    <Card key={bird.id} className="overflow-hidden">
                      <div className="flex">
                        {bird.imageUrl && (
                          <div className="w-1/3 min-h-[150px] overflow-hidden">
                            <img
                              src={bird.imageUrl}
                              alt={bird.commonName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-4">
                          <h3 className="font-medium text-lg">
                            {bird.commonName}
                          </h3>
                          <p className="text-sm text-slate-500 italic mb-2">
                            {bird.scientificName}
                          </p>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                            <div className="flex">
                              <span className="text-slate-500 mr-1">Size:</span>
                              <span>Medium</span>
                            </div>
                            <div className="flex">
                              <span className="text-slate-500 mr-1">
                                Weight:
                              </span>
                              <span>120g</span>
                            </div>
                            <div className="flex">
                              <span className="text-slate-500 mr-1">
                                Color:
                              </span>
                              <span>Brown, Red</span>
                            </div>
                            <div className="flex">
                              <span className="text-slate-500 mr-1">Bill:</span>
                              <span>Short, Straight</span>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/birds/${bird.id}/characteristics/add`,
                                )
                              }
                            >
                              Edit Characteristics
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sounds">
          <Card>
            <CardHeader>
              <CardTitle>Sound Library</CardTitle>
              <CardDescription>
                Animal calls and songs collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">
                  Sound Library Coming Soon
                </h3>
                <p className="text-slate-500 mb-4">
                  This feature is under development. Soon you'll be able to
                  manage and play animal sounds.
                </p>
                <Button>Notify Me When Available</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habitat">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Habitat Information</CardTitle>
                <CardDescription>
                  Explore where different animal species live
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by habitat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Habitats</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="wetland">Wetland</SelectItem>
                    <SelectItem value="grassland">Grassland</SelectItem>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="coastal">Coastal</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Habitat
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">Loading habitat data...</p>
                </div>
              ) : isError ? (
                <div className="text-center py-12">
                  <p className="text-red-500">Error loading habitat data</p>
                </div>
              ) : birds?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">
                    No habitat information available yet
                  </p>
                  <Button
                    className="mt-2 bg-gradient-to-r from-blue-600 to-teal-400"
                    onClick={() => navigate("/birds/add")}
                  >
                    Add Your First ANIMAL
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {birds?.map((bird) => (
                    <Card key={bird.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {bird.commonName}
                        </CardTitle>
                        <CardDescription>{bird.scientificName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="flex mb-1">
                            <MapPin className="h-4 w-4 text-slate-500 mr-2" />
                            <h4 className="text-sm font-medium">Habitat</h4>
                          </div>
                          <p className="text-sm text-slate-600 pl-6">
                            {bird.description.substring(0, 100)}...
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4">
                          <div>
                            <span className="text-slate-500 block text-xs">
                              Continents:
                            </span>
                            <span>North America</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-xs">
                              Elevation:
                            </span>
                            <span>0-2000m</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-xs">
                              Environment:
                            </span>
                            <span>Forest, Woodland edges</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-xs">
                              Countries:
                            </span>
                            <span>USA, Canada, Mexico</span>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/birds/${bird.id}/habitat/add`)
                            }
                          >
                            Edit Habitat
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="migration">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Migration Patterns</CardTitle>
                <CardDescription>
                  Track seasonal movements of bird species
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full">Full migrants</SelectItem>
                    <SelectItem value="partial">Partial migrants</SelectItem>
                    <SelectItem value="resident">Residents</SelectItem>
                    <SelectItem value="altitudinal">
                      Altitudinal migrants
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Migration
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">Loading migration data...</p>
                </div>
              ) : isError ? (
                <div className="text-center py-12">
                  <p className="text-red-500">Error loading migration data</p>
                </div>
              ) : birds?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">
                    No migration data available yet
                  </p>
                  <Button
                    className="mt-2 bg-gradient-to-r from-blue-600 to-teal-400"
                    onClick={() => navigate("/birds/add")}
                  >
                    Add Your First Animal
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {birds?.map((bird) => (
                    <Card key={bird.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:p-6 flex-1">
                          <h3 className="font-medium text-lg mb-1">
                            {bird.commonName}
                          </h3>
                          <p className="text-sm text-slate-500 italic mb-4">
                            {bird.scientificName}
                          </p>

                          <div className="flex items-center mb-3">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="font-medium">Migration Type:</span>
                            <span className="ml-2">Full migrant</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                            <div>
                              <span className="text-slate-500 block">
                                Breeding Range:
                              </span>
                              <span>Northern USA, Canada</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">
                                Wintering Range:
                              </span>
                              <span>Southern USA, Mexico</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">
                                Migration Seasons:
                              </span>
                              <span>March-April, September-October</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">
                                Distance:
                              </span>
                              <span>Up to 3,000 km</span>
                            </div>
                          </div>

                          <div className="mt-6 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/birds/${bird.id}/migration/add`)
                              }
                            >
                              Edit Migration Data
                            </Button>
                          </div>
                        </div>
                        <div className="w-full md:w-1/3 bg-slate-100 flex items-center justify-center p-4">
                          <div className="text-center">
                            <MapPin className="h-10 w-10 text-slate-400 mx-auto" />
                            <span className="text-sm text-slate-500 block mt-2">
                              Migration Map
                            </span>
                            <Button variant="link" size="sm" className="mt-1">
                              Add Map
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
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
