import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "wouter";
import { addBirdSeasonalAppearance, fetchBirdDetails } from "@/lib/api";
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

// Create a schema for seasonal appearance
const seasonalFormSchema = z.object({
  season: z.string({
    required_error: "Please select a season",
  }),
  plumageDescription: z.string().min(2, "Plumage description is required"),
  behavioralChanges: z.string().optional(),
  seasonalLocation: z.string().optional(),
  seasonalDiet: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type SeasonalFormValues = z.infer<typeof seasonalFormSchema>;

export default function AddBirdSeasonal() {
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
  const form = useForm<SeasonalFormValues>({
    resolver: zodResolver(seasonalFormSchema),
    defaultValues: {
      season: "",
      plumageDescription: "",
      behavioralChanges: "",
      seasonalLocation: "",
      seasonalDiet: "",
      imageUrl: "",
    },
  });

  // Create a mutation for adding seasonal appearance
  const addSeasonalMutation = useMutation({
    mutationFn: (data: SeasonalFormValues) => 
      addBirdSeasonalAppearance(birdId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/birds', birdId] });
      toast({
        title: "Seasonal Information Added",
        description: "Seasonal appearance information has been added successfully.",
      });
      navigate(`/birds/${birdId}`);
    },
    onError: (error) => {
      console.error("Error adding seasonal information:", error);
      toast({
        title: "Error Adding Seasonal Info",
        description: "There was an error adding the seasonal appearance information. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Handle form submission
  const onSubmit = (values: SeasonalFormValues) => {
    setIsSubmitting(true);
    // If imageUrl is empty string, set to undefined
    const submitData = {
      ...values,
      imageUrl: values.imageUrl || undefined,
    };
    addSeasonalMutation.mutate(submitData);
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
          Add Seasonal Appearance
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Add seasonal appearance information for {bird.commonName} ({bird.scientificName}).
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Appearance Information</CardTitle>
            <CardDescription>
              Enter details about how the bird appears and behaves during a specific season.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="season"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Season*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a season" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Spring">Spring</SelectItem>
                          <SelectItem value="Summer">Summer</SelectItem>
                          <SelectItem value="Fall">Fall/Autumn</SelectItem>
                          <SelectItem value="Winter">Winter</SelectItem>
                          <SelectItem value="Breeding">Breeding Season</SelectItem>
                          <SelectItem value="Non-breeding">Non-breeding Season</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The season or period this information applies to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="plumageDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plumage Description*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g. Bright breeding colors, Dull winter plumage" 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Description of the bird's plumage during this season.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="behavioralChanges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Behavioral Changes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g. More vocal, Forms large flocks" 
                          rows={2}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Changes in behavior during this season.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seasonalLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seasonal Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Coastal areas, Inland forests" {...field} />
                      </FormControl>
                      <FormDescription>
                        Where the bird is typically found during this season.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seasonalDiet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seasonal Diet</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Primarily insects, Seeds and berries" {...field} />
                      </FormControl>
                      <FormDescription>
                        The bird's typical diet during this season.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seasonal Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/seasonal-image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL to an image showing the bird during this season.
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
                    {isSubmitting ? "Adding..." : "Add Seasonal Information"}
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