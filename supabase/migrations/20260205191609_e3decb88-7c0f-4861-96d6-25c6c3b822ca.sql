-- Create company_profiles table with all structured sections
CREATE TABLE public.company_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Company Profile',
  template TEXT NOT NULL DEFAULT 'corporate',
  
  -- Basic Information
  basic_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Registration & Legal Details
  legal_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Contact Information
  contact_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Management & Organization
  management JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Company Overview
  overview TEXT,
  
  -- Vision, Mission & Values
  vision_mission JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Services & Capabilities
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Products
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Projects / Experience
  projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Clients & Partners
  clients_partners JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Certifications & Approvals
  certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- HSE & Quality
  hse_quality JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Theme customization
  theme_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Section visibility
  visible_sections JSONB NOT NULL DEFAULT '["basic_info", "contact_info", "overview", "vision_mission", "services", "projects", "certifications"]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own company profiles" 
ON public.company_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own company profiles" 
ON public.company_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company profiles" 
ON public.company_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own company profiles" 
ON public.company_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_company_profiles_updated_at
BEFORE UPDATE ON public.company_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();