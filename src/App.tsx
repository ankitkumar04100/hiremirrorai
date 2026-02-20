import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MockInterview from "./pages/MockInterview";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import Skills from "./pages/Skills";
import Gamification from "./pages/Gamification";
import NotFound from "./pages/NotFound";
import AIMentor from "./components/AIMentor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview" element={<MockInterview />} />
          <Route path="/resume" element={<ResumeAnalysis />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/gamification" element={<Gamification />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIMentor />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
