import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "wouter";
import { addBirdHabitatRange, fetchBirdDetails } from "@/lib/api";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Create a schema for habitat range
const habitatFormSchema = z.object({
  habitat: z.string().min(2, "Habitat description is required"),
  continents: z.string().min(2, "Continents information is required"),
  countries: z.string().optional(),
  elevationRange: z.string().optional(),
  preferredEnvironment: z.string().optional(),
  mapImageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

type HabitatFormValues = z.infer<typeof habitatFormSchema>;

export default function AddBirdHabitat() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const birdId = parseInt(id);

  // Get bird details
  const {
    data: birdDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["/api/birds", birdId],
    queryFn: () => fetchBirdDetails(birdId),
    enabled: !isNaN(birdId),
  });

  // Initialize the form
  const form = useForm<HabitatFormValues>({
    resolver: zodResolver(habitatFormSchema),
    defaultValues: {
      habitat: "",
      continents: "",
      countries: "",
      elevationRange: "",
      preferredEnvironment: "",
      mapImageUrl: "",
    },
  });

  // Create a mutation for adding habitat range
  const addHabitatMutation = useMutation({
    mutationFn: (data: HabitatFormValues) => addBirdHabitatRange(birdId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/birds", birdId] });
      toast({
        title: "Habitat Information Added",
        description:
          "Habitat and range information have been added successfully.",
      });
      navigate(`/birds/${birdId}`);
    },
    onError: (error) => {
      console.error("Error adding habitat information:", error);
      toast({
        title: "Error Adding Habitat",
        description:
          "There was an error adding the habitat information. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Handle form submission
  const onSubmit = (values: HabitatFormValues) => {
    setIsSubmitting(true);
    // If mapImageUrl is empty string, set to undefined
    const submitData = {
      ...values,
      mapImageUrl: values.mapImageUrl || undefined,
    };
    addHabitatMutation.mutate(submitData);
  };

  if (isNaN(birdId)) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Animal ID</h1>
        <Button onClick={() => navigate("/birds")}>
          Return to Animal List
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
        </div>
      </div>
    );
  }

  if (isError || !birdDetails) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Animal</h1>
        <p className="mb-6 text-red-500">
          An error occurred while loading the animal information.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate("/birds")}>
            Return to Birds List
          </Button>
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
          Add Habitat & Range
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Add habitat and range information for {bird.commonName} (
          {bird.scientificName}).
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Habitat & Range Information</CardTitle>
            <CardDescription>
              Enter details about where this animal species lives and its
              geographical distribution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="habitat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Habitat Type*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Forest, Wetland, Urban"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The type of habitat where the animal is found.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="continents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Continents*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. North America, Europe"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The continents where the bird is found.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="countries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Countries</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. USA, Canada, Mexico"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The countries where the Animal is found.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="elevationRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Elevation Range</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 0-500m, 1000-3000m"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The elevation range where the bird is found.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredEnvironment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Environment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. Near water bodies, Dense forests"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Description of the specific environment the animal
                        prefers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mapImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Range Map URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/range-map.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL to an image showing the animal's geographical
                        distribution.
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
                    {isSubmitting ? "Adding..." : "Add Habitat Information"}
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
