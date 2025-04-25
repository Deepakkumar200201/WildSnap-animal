import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { insertAnimalPhysicalCharacteristicsSchema } from "@shared/schema";

// Extend the schema with validation
const characteristicsFormSchema = insertAnimalPhysicalCharacteristicsSchema
  .omit({ animalId: true })
  .extend({
    colorPattern: z.string().min(2, "Color pattern is required"),
  });

type CharacteristicsFormValues = z.infer<typeof characteristicsFormSchema>;

export default function AddAnimalCharacteristics() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch animal to display name in header
  const { data: animal } = useQuery({
    queryKey: ["/api/animals", id],
    queryFn: async () => {
      const response = await fetch(`/api/animals/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch animal");
      }
      const data = await response.json();
      return data.animal;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const form = useForm<CharacteristicsFormValues>({
    resolver: zodResolver(characteristicsFormSchema),
    defaultValues: {
      colorPattern: "",
      size: "",
      weight: "",
      bodyLength: "",
      limbs: "",
      specialFeatures: "",
      lifespan: "",
      distinctiveFeatures: "",
    },
  });

  const addCharacteristicsMutation = useMutation({
    mutationFn: async (values: CharacteristicsFormValues) => {
      const dataToSend = {
        ...values,
        animalId: parseInt(id),
      };

      const response = await fetch(`/api/animals/${id}/physical-characteristics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add physical characteristics");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate animal details query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/animals", id] });
      
      toast({
        title: "Characteristics Added",
        description: "The physical characteristics have been successfully added.",
        variant: "default",
      });
      
      setLocation(`/animals/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add characteristics. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: CharacteristicsFormValues) => {
    setIsSubmitting(true);
    addCharacteristicsMutation.mutate(values);
  };

  return (
    <div className="container py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Add Physical Characteristics</h1>
          {animal && (
            <p className="text-gray-500">
              for {animal.commonName}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={() => setLocation(`/animals/${id}`)}>
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="colorPattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color Pattern <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Black and white striped pattern" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Medium (50-70cm tall)" {...field} />
                  </FormControl>
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
                    <Input placeholder="e.g., 20-40kg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="bodyLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Length</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1.5-2m from nose to tail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="limbs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limbs</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Four strong limbs with sharp claws" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="specialFeatures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Features</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Long prehensile tail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lifespan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lifespan</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 10-15 years in the wild" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="distinctiveFeatures"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distinctive Features</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., Notable for its distinctive markings and characteristic behaviors..." 
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setLocation(`/animals/${id}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add Characteristics"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}