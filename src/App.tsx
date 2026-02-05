import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { CompanyProfileProvider } from "@/contexts/CompanyProfileContext";
import Index from "./pages/Index";
import Builder from "./pages/Builder";
import MyResumes from "./pages/MyResumes";
import CompanyBuilder from "./pages/CompanyBuilder";
import MyCompanyProfiles from "./pages/MyCompanyProfiles";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ResumeProvider>
        <CompanyProfileProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/builder" element={<Builder />} />
                <Route path="/my-resumes" element={<MyResumes />} />
                <Route path="/company-builder" element={<CompanyBuilder />} />
                <Route path="/my-company-profiles" element={<MyCompanyProfiles />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CompanyProfileProvider>
      </ResumeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
