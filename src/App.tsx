
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import IndexNew from "./pages/IndexNew";
import ProfilePage from "./pages/Profile"
import MealsPage from "./pages/Meals"
import MedicationsPage from "./pages/Medications";
import AppointmentsPage from "./pages/Appointments";
import ChatPage from "./pages/Chat";
import GlucosePage from "./pages/Glucose";
import CaregiverPage from "./pages/Caregiver";
import VoiceChatPage from "./pages/VoiceChat";
import './globals.css'
import './pages/globals.css'
import { useEffect } from "react";

import NotFound from "./pages/NotFound";
// import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexNew />} />
            <Route path="/old" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/glucose" element={<GlucosePage />} />
            <Route path="/medications" element={<MedicationsPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/caregiver" element={<CaregiverPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/voice-chat" element={<VoiceChatPage />} />  
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
