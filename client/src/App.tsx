import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Birds from "@/pages/Birds";
import BirdDetails from "@/pages/BirdDetails";
import AddBird from "@/pages/AddBird";
import AddBirdCharacteristics from "@/pages/AddBirdCharacteristics";
import AddBirdHabitat from "@/pages/AddBirdHabitat";
import AddBirdMigration from "@/pages/AddBirdMigration";
import AddBirdSeasonal from "@/pages/AddBirdSeasonal";
import Dashboard from "@/pages/Dashboard";
import Animals from "@/pages/Animals";
import AnimalDetails from "@/pages/AnimalDetails";
import AddAnimal from "@/pages/AddAnimal";
import AddAnimalCharacteristics from "@/pages/AddAnimalCharacteristics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/birds" component={Birds} />
      <Route path="/birds/add" component={AddBird} />
      <Route path="/birds/:id" component={BirdDetails} />
      <Route path="/birds/:id/characteristics/add" component={AddBirdCharacteristics} />
      <Route path="/birds/:id/habitat/add" component={AddBirdHabitat} />
      <Route path="/birds/:id/migration/add" component={AddBirdMigration} />
      <Route path="/birds/:id/seasonal/add" component={AddBirdSeasonal} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
