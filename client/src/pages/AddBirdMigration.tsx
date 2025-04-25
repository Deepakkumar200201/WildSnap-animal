import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "wouter";
import { addBirdMigrationPattern, fetchBirdDetails } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Create a schema for migration patterns
const migrationFormSchema = z.object({
  migrationType: z.string({
    required_error: "Please select a migration type",
  }),
  breedingRange: z.string().optional(),
  winteringRange: z.string().optional(),
  migrationSeasons: z.string().optional(),
  migrationRoutes: z.string().optional(),
  stopoverSites: z.string().optional(),
  migrationDistance: z.string().optional(),
  migrationMapUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type MigrationFormValues = z.infer<typeof migrationFormSchema>;

export default function AddBirdMigration() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const birdId = parseInt(id);
  
  // Get bird details
  const { data: birdDetails, isLoading, isError } = useQuery({
    queryKey: ['/api/birds', birdId],
    queryFn: () => fetchBirdDetails(birdId),
    enabled: !isNaN(birdId),
  });

  // Initialize the form
  const form = useForm<MigrationFormValues>({
    resolver: zodResolver(migrationFormSchema),
    defaultValues: {
      migrationType: "",
      breedingRange: "",
      winteringRange: "",
      migrationSeasons: "",
      migrationRoutes: "",
      stopoverSites: "",
      migrationDistance: "",
      migrationMapUrl: "",
    },
  });

  // Create a mutation for adding migration pattern
  const addMigrationMutation = useMutation({
    mutationFn: (data: MigrationFormValues) => 
      addBirdMigrationPattern(birdId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/birds', birdId] });
      toast({
        title: "Migration Information Added",
        description: "Migration pattern information has been added successfully.",
      });
      navigate(`/birds/${birdId}`);
    },
    onError: (error) => {
      console.error("Error adding migration information:", error);
      toast({
        title: "Error Adding Migration Info",
        description: "There was an error adding the migration information. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Handle form submission
  const onSubmit = (values: MigrationFormValues) => {
    setIsSubmitting(true);
    // If migrationMapUrl is empty string, set to undefined
    const submitData = {
      ...values,
      migrationMapUrl: values.migrationMapUrl || undefined,
    };
    addMigrationMutation.mutate(submitData);
  };

  if (isNaN(birdId)) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Bird ID</h1>
        <Button onClick={() => navigate("/birds")}>Return to Birds List</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 w-1/3 mx-auto rounded mb-8"></div>
          <div className="h-6 bg-slate-200 w-1/2 mx-auto rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (isError || !birdDetails) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Bird</h1>
        <p className="mb-6 text-red-500">An error occurred while loading the bird information.</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate("/birds")}>Return to Birds List</Button>
        </div>
      </div>
    );
  }

  const { bird } = birdDetails;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href={`/birds/${birdId}`}>
          <Button variant="ghost" className="mb-2">
            &larr; Back to {bird.commonName}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
          Add Migration Pattern
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Add migration pattern information for {bird.commonName} ({bird.scientificName}).
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Migration Pattern Information</CardTitle>
            <CardDescription>
              Enter details about the bird's migratory behavior and routes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="migrationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Migration Type*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select migration type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full migrant">Full migrant</SelectItem>
                          <SelectItem value="Partial migrant">Partial migrant</SelectItem>
                          <SelectItem value="Resident">Resident (non-migratory)</SelectItem>
                          <SelectItem value="Altitudinal migrant">Altitudinal migrant</SelectItem>
                          <SelectItem value="Nomadic">Nomadic</SelectItem>
                          <SelectItem value="Irruptive">Irruptive migrant</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of migratory behavior exhibited by the bird.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="breedingRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breeding Range</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Northern Europe" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where the bird breeds.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="winteringRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wintering Range</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Central Africa" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where the bird spends the winter.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="migrationSeasons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Migration Seasons</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. March-April, September-October" {...field} />
                      </FormControl>
                      <FormDescription>
                        When the bird typically migrates.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="migrationRoutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Migration Routes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g. Eastern Atlantic, Mississippi Flyway" 
                          rows={2}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The routes commonly taken during migration.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="stopoverSites"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stopover Sites</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Great Lakes, Mediterranean coast" {...field} />
                        </FormControl>
                        <FormDescription>
                          Key stopover locations during migration.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="migrationDistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Migration Distance</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Up to 10,000 km" {...field} />
                        </FormControl>
                        <FormDescription>
                          Typical distance traveled during migration.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="migrationMapUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Migration Map URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/migration-map.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL to an image showing the bird's migration routes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(`/birds/${birdId}`)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-teal-400 text-white"
                  >
                    {isSubmitting ? "Adding..." : "Add Migration Information"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}