import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  CompanyProfileData,
  CompanyProfileTemplate,
  BasicInfo,
  LegalDetails,
  ContactInfo,
  Management,
  VisionMission,
  Service,
  Product,
  Project,
  ClientsPartners,
  Certification,
  HseQuality,
  ThemeSettings,
  KeyPersonnel,
  initialCompanyProfileData,
} from '@/types/companyProfile';

interface CompanyProfileContextType {
  profileData: CompanyProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<CompanyProfileData>>;
  updateBasicInfo: (info: Partial<BasicInfo>) => void;
  updateLegalDetails: (details: Partial<LegalDetails>) => void;
  updateContactInfo: (info: Partial<ContactInfo>) => void;
  updateManagement: (management: Partial<Management>) => void;
  updateOverview: (overview: string) => void;
  updateVisionMission: (visionMission: Partial<VisionMission>) => void;
  addService: (service: Service) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  removeService: (id: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  updateClientsPartners: (data: Partial<ClientsPartners>) => void;
  addCertification: (certification: Certification) => void;
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  updateHseQuality: (hseQuality: Partial<HseQuality>) => void;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  setTemplate: (template: CompanyProfileTemplate) => void;
  toggleSectionVisibility: (section: string) => void;
  addKeyPersonnel: (personnel: KeyPersonnel) => void;
  updateKeyPersonnel: (id: string, personnel: Partial<KeyPersonnel>) => void;
  removeKeyPersonnel: (id: string) => void;
  resetProfile: () => void;
  loadProfile: (data: CompanyProfileData) => void;
}

const CompanyProfileContext = createContext<CompanyProfileContextType | undefined>(undefined);

export const CompanyProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileData, setProfileData] = useState<CompanyProfileData>(initialCompanyProfileData);

  const updateBasicInfo = (info: Partial<BasicInfo>) => {
    setProfileData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...info },
    }));
  };

  const updateLegalDetails = (details: Partial<LegalDetails>) => {
    setProfileData((prev) => ({
      ...prev,
      legalDetails: { ...prev.legalDetails, ...details },
    }));
  };

  const updateContactInfo = (info: Partial<ContactInfo>) => {
    setProfileData((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, ...info },
    }));
  };

  const updateManagement = (management: Partial<Management>) => {
    setProfileData((prev) => ({
      ...prev,
      management: { ...prev.management, ...management },
    }));
  };

  const updateOverview = (overview: string) => {
    setProfileData((prev) => ({ ...prev, overview }));
  };

  const updateVisionMission = (visionMission: Partial<VisionMission>) => {
    setProfileData((prev) => ({
      ...prev,
      visionMission: { ...prev.visionMission, ...visionMission },
    }));
  };

  const addService = (service: Service) => {
    setProfileData((prev) => ({
      ...prev,
      services: [...prev.services, service],
    }));
  };

  const updateService = (id: string, service: Partial<Service>) => {
    setProfileData((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...service } : s)),
    }));
  };

  const removeService = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
  };

  const addProduct = (product: Product) => {
    setProfileData((prev) => ({
      ...prev,
      products: [...prev.products, product],
    }));
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProfileData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
    }));
  };

  const removeProduct = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  };

  const addProject = (project: Project) => {
    setProfileData((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
    }));
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    setProfileData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...project } : p)),
    }));
  };

  const removeProject = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const updateClientsPartners = (data: Partial<ClientsPartners>) => {
    setProfileData((prev) => ({
      ...prev,
      clientsPartners: { ...prev.clientsPartners, ...data },
    }));
  };

  const addCertification = (certification: Certification) => {
    setProfileData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, certification],
    }));
  };

  const updateCertification = (id: string, certification: Partial<Certification>) => {
    setProfileData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...certification } : c)),
    }));
  };

  const removeCertification = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  const updateHseQuality = (hseQuality: Partial<HseQuality>) => {
    setProfileData((prev) => ({
      ...prev,
      hseQuality: { ...prev.hseQuality, ...hseQuality },
    }));
  };

  const updateThemeSettings = (settings: Partial<ThemeSettings>) => {
    setProfileData((prev) => ({
      ...prev,
      themeSettings: { ...prev.themeSettings, ...settings },
    }));
  };

  const setTemplate = (template: CompanyProfileTemplate) => {
    setProfileData((prev) => ({ ...prev, template }));
  };

  const toggleSectionVisibility = (section: string) => {
    setProfileData((prev) => {
      const visible = prev.visibleSections.includes(section);
      return {
        ...prev,
        visibleSections: visible
          ? prev.visibleSections.filter((s) => s !== section)
          : [...prev.visibleSections, section],
      };
    });
  };

  const addKeyPersonnel = (personnel: KeyPersonnel) => {
    setProfileData((prev) => ({
      ...prev,
      management: {
        ...prev.management,
        keyPersonnel: [...prev.management.keyPersonnel, personnel],
      },
    }));
  };

  const updateKeyPersonnel = (id: string, personnel: Partial<KeyPersonnel>) => {
    setProfileData((prev) => ({
      ...prev,
      management: {
        ...prev.management,
        keyPersonnel: prev.management.keyPersonnel.map((p) =>
          p.id === id ? { ...p, ...personnel } : p
        ),
      },
    }));
  };

  const removeKeyPersonnel = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      management: {
        ...prev.management,
        keyPersonnel: prev.management.keyPersonnel.filter((p) => p.id !== id),
      },
    }));
  };

  const resetProfile = () => {
    setProfileData(initialCompanyProfileData);
  };

  const loadProfile = (data: CompanyProfileData) => {
    setProfileData(data);
  };

  return (
    <CompanyProfileContext.Provider
      value={{
        profileData,
        setProfileData,
        updateBasicInfo,
        updateLegalDetails,
        updateContactInfo,
        updateManagement,
        updateOverview,
        updateVisionMission,
        addService,
        updateService,
        removeService,
        addProduct,
        updateProduct,
        removeProduct,
        addProject,
        updateProject,
        removeProject,
        updateClientsPartners,
        addCertification,
        updateCertification,
        removeCertification,
        updateHseQuality,
        updateThemeSettings,
        setTemplate,
        toggleSectionVisibility,
        addKeyPersonnel,
        updateKeyPersonnel,
        removeKeyPersonnel,
        resetProfile,
        loadProfile,
      }}
    >
      {children}
    </CompanyProfileContext.Provider>
  );
};

export const useCompanyProfile = () => {
  const context = useContext(CompanyProfileContext);
  if (context === undefined) {
    throw new Error('useCompanyProfile must be used within a CompanyProfileProvider');
  }
  return context;
};
