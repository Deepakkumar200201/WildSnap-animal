import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "wouter";
import { addBirdPhysicalCharacteristics, fetchBirdDetails } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Create a schema for physical characteristics
const characteristicsFormSchema = z.object({
  size: z.string().optional(),
  weight: z.string().optional(),
  wingspan: z.string().optional(),
  plumageColor: z.string().min(2, "Plumage color description is required"),
  billShape: z.string().optional(),
  legColor: z.string().optional(),
  eyeColor: z.string().optional(),
  distinctiveFeatures: z.string().optional(),
});

type CharacteristicsFormValues = z.infer<typeof characteristicsFormSchema>;

export default function AddBirdCharacteristics() {
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
  const form = useForm<CharacteristicsFormValues>({
    resolver: zodResolver(characteristicsFormSchema),
    defaultValues: {
      size: "",
      weight: "",
      wingspan: "",
      plumageColor: "",
      billShape: "",
      legColor: "",
      eyeColor: "",
      distinctiveFeatures: "",
    },
  });

  // Create a mutation for adding physical characteristics
  const addCharacteristicsMutation = useMutation({
    mutationFn: (data: CharacteristicsFormValues) =>
      addBirdPhysicalCharacteristics(birdId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/birds", birdId] });
      toast({
        title: "Characteristics Added",
        description: "Physical characteristics have been added successfully.",
      });
      navigate(`/birds/${birdId}`);
    },
    onError: (error) => {
      console.error("Error adding characteristics:", error);
      toast({
        title: "Error Adding Characteristics",
        description:
          "There was an error adding the physical characteristics. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Handle form submission
  const onSubmit = (values: CharacteristicsFormValues) => {
    setIsSubmitting(true);
    addCharacteristicsMutation.mutate(values);
  };

  if (isNaN(birdId)) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid animal ID</h1>
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
        <h1 className="text-2xl font-bold mb-4">Error Loading Bird</h1>
        <p className="mb-6 text-red-500">
          An error occurred while loading the bird information.
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
          Add Physical Characteristics
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Add physical characteristics details for {bird.commonName} (
          {bird.scientificName}).
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Physical Characteristics</CardTitle>
            <CardDescription>
              Enter details about the animal's physical appearance. Only plumage
              color is required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Small (15-20cm)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The size range of the bird.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 15-30g" {...field} />
                        </FormControl>
                        <FormDescription>
                          The weight range of the bird.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="wingspan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wingspan</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 30-40cm" {...field} />
                        </FormControl>
                        <FormDescription>
                          The wingspan of the bird.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="plumageColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plumage Color*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Red head, brown body"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Description of the animal's plumage colors.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="billShape"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bill Shape</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Long and pointed"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Description of the animal's bill.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leg Color</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Yellow" {...field} />
                        </FormControl>
                        <FormDescription>
                          Color of the bird's legs.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="eyeColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Eye Color</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Red" {...field} />
                        </FormControl>
                        <FormDescription>
                          Color of the animal's eyes.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="distinctiveFeatures"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distinctive Features</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Crest on head" {...field} />
                        </FormControl>
                        <FormDescription>
                          Any distinctive physical features.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                    {isSubmitting ? "Adding..." : "Add Characteristics"}
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
