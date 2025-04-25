import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertAnimalSchema } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

// Extend the schema with more detailed validation
const animalFormSchema = insertAnimalSchema.extend({
  commonName: z.string().min(2, "Common name must be at least 2 characters"),
  scientificName: z.string().min(2, "Scientific name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  animalClass: z.string().min(1, "Animal class is required"),
});

type AnimalFormValues = z.infer<typeof animalFormSchema>;

export default function AddAnimal() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(animalFormSchema),
    defaultValues: {
      commonName: "",
      scientificName: "",
      description: "",
      animalClass: "",
      animalOrder: "",
      animalFamily: "",
      imageUrl: "",
    },
  });

  const createAnimalMutation = useMutation({
    mutationFn: async (values: AnimalFormValues) => {
      const response = await fetch("/api/animals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create animal");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate animals query to refresh list
      queryClient.invalidateQueries({ queryKey: ["animals"] });
      
      toast({
        title: "Animal Added",
        description: "The animal has been successfully added to the database.",
        variant: "default",
      });
      
      setLocation("/animals");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add animal. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: AnimalFormValues) => {
    setIsSubmitting(true);
    createAnimalMutation.mutate(values);
  };

  return (
    <div className="container py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add New Animal</h1>
        <Button variant="outline" onClick={() => setLocation("/animals")}>
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="commonName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Common Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Red Fox" {...field} />
                  </FormControl>
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
                    <Input placeholder="e.g., Vulpes vulpes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide a general description of the animal..." 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="animalClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mammal">Mammal</SelectItem>
                      <SelectItem value="Bird">Bird</SelectItem>
                      <SelectItem value="Reptile">Reptile</SelectItem>
                      <SelectItem value="Amphibian">Amphibian</SelectItem>
                      <SelectItem value="Fish">Fish</SelectItem>
                      <SelectItem value="Arthropod">Arthropod</SelectItem>
                      <SelectItem value="Mollusk">Mollusk</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="animalOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Carnivora" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="animalFamily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Family (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Canidae" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/animal-image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setLocation("/animals")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add Animal"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}