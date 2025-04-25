import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { createBird } from "@/lib/api";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Create a schema for bird creation
const birdFormSchema = z.object({
  commonName: z.string().min(2, "Common name must be at least 2 characters"),
  scientificName: z
    .string()
    .min(2, "Scientific name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type BirdFormValues = z.infer<typeof birdFormSchema>;

export default function AddBird() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<BirdFormValues>({
    resolver: zodResolver(birdFormSchema),
    defaultValues: {
      commonName: "",
      scientificName: "",
      description: "",
      imageUrl: "",
    },
  });

  // Create a mutation for adding a bird
  const addBirdMutation = useMutation({
    mutationFn: createBird,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/birds"] });
      toast({
        title: "Bird Added Successfully",
        description: `${data.commonName} has been added to the database.`,
      });
      navigate(`/birds/${data.id}`);
    },
    onError: (error) => {
      console.error("Error adding bird:", error);
      toast({
        title: "Error Adding Bird",
        description: "There was an error adding the bird. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Handle form submission
  const onSubmit = (values: BirdFormValues) => {
    setIsSubmitting(true);

    // If imageUrl is empty string, set to undefined
    const submitData = {
      ...values,
      imageUrl: values.imageUrl || undefined,
    };

    addBirdMutation.mutate(submitData);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/birds">
          <Button variant="ghost" className="mb-2">
            &larr; Back to Animal
          </Button>
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
          Add New Animal
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Add a new Animal to the database with basic information. You can add
          detailed characteristics later.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Animal Information</CardTitle>
            <CardDescription>
              Enter the basic information about the animal species.
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
                  name="commonName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Common Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. American Robin" {...field} />
                      </FormControl>
                      <FormDescription>
                        The common name of the animal species.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scientificName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scientific Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Turdus migratorius"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The scientific name in Latin (genus and species).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the bird species..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A general description of the animal species.
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
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/bird-image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL to an image of the animal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/birds")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-teal-400 text-white"
                  >
                    {isSubmitting ? "Adding..." : "Add Bird"}
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
