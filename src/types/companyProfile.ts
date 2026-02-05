export interface BranchLocation {
  id: string;
  country: string;
  city: string;
}

export interface BasicInfo {
  legalName: string;
  tradeName: string;
  logo: string;
  slogan: string;
  yearEstablished: string;
  companyType: string;
  industrySectors: string[];
  companySize: string;
  headquartersCountry: string;
  headquartersCity: string;
  branchLocations: BranchLocation[];
}

export interface LegalDetails {
  commercialRegNumber: string;
  regIssuingAuthority: string;
  dateOfRegistration: string;
  licenseNumber: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  taxNumber: string;
  chamberOfCommerce: boolean;
  complianceCertificates: string[];
}

export interface SocialMedia {
  linkedin: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

export interface ContactInfo {
  officeAddress: string;
  phoneNumbers: string[];
  emailGeneral: string;
  emailSales: string;
  emailSupport: string;
  website: string;
  socialMedia: SocialMedia;
}

export interface KeyPersonnel {
  id: string;
  name: string;
  designation: string;
  department: string;
  yearsOfExperience: string;
  bio: string;
}

export interface Management {
  keyPersonnel: KeyPersonnel[];
  organizationDescription: string;
  orgChartUrl: string;
}

export interface VisionMission {
  vision: string;
  mission: string;
  coreValues: string[];
}

export interface Service {
  id: string;
  category: string;
  title: string;
  description: string;
  keyCapabilities: string[];
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  specifications: string;
  images: string[];
  certifications: string[];
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  location: string;
  startDate: string;
  endDate: string;
  scopeOfWork: string;
  projectValue: string;
  highlights: string[];
  isConfidential: boolean;
}

export interface ClientsPartners {
  clientLogos: string[];
  partnerNames: string[];
  principalOemDetails: string;
  hideClientNames: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  certificateUrl: string;
  isSafetyApproval: boolean;
}

export interface HseQuality {
  hsePolicy: string;
  qualityPolicy: string;
  safetyStatistics: string;
  hsePolicyDocUrl: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  headerStyle: string;
  footerStyle: string;
  pageLayout: 'one-column' | 'two-column';
  logoPlacement: 'left' | 'center' | 'right';
}

export type CompanyProfileTemplate = 
  | 'corporate' 
  | 'modern' 
  | 'industrial' 
  | 'tender' 
  | 'brochure' 
  | 'minimal';

export interface CompanyProfileData {
  id?: string;
  title: string;
  template: CompanyProfileTemplate;
  basicInfo: BasicInfo;
  legalDetails: LegalDetails;
  contactInfo: ContactInfo;
  management: Management;
  overview: string;
  visionMission: VisionMission;
  services: Service[];
  products: Product[];
  projects: Project[];
  clientsPartners: ClientsPartners;
  certifications: Certification[];
  hseQuality: HseQuality;
  themeSettings: ThemeSettings;
  visibleSections: string[];
}

export const initialBasicInfo: BasicInfo = {
  legalName: '',
  tradeName: '',
  logo: '',
  slogan: '',
  yearEstablished: '',
  companyType: '',
  industrySectors: [],
  companySize: '',
  headquartersCountry: '',
  headquartersCity: '',
  branchLocations: [],
};

export const initialLegalDetails: LegalDetails = {
  commercialRegNumber: '',
  regIssuingAuthority: '',
  dateOfRegistration: '',
  licenseNumber: '',
  licenseIssueDate: '',
  licenseExpiryDate: '',
  taxNumber: '',
  chamberOfCommerce: false,
  complianceCertificates: [],
};

export const initialContactInfo: ContactInfo = {
  officeAddress: '',
  phoneNumbers: [''],
  emailGeneral: '',
  emailSales: '',
  emailSupport: '',
  website: '',
  socialMedia: {
    linkedin: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
  },
};

export const initialManagement: Management = {
  keyPersonnel: [],
  organizationDescription: '',
  orgChartUrl: '',
};

export const initialVisionMission: VisionMission = {
  vision: '',
  mission: '',
  coreValues: [],
};

export const initialThemeSettings: ThemeSettings = {
  primaryColor: '#1e40af',
  secondaryColor: '#64748b',
  fontFamily: 'Inter',
  headerStyle: 'modern',
  footerStyle: 'simple',
  pageLayout: 'one-column',
  logoPlacement: 'left',
};

export const initialHseQuality: HseQuality = {
  hsePolicy: '',
  qualityPolicy: '',
  safetyStatistics: '',
  hsePolicyDocUrl: '',
};

export const initialClientsPartners: ClientsPartners = {
  clientLogos: [],
  partnerNames: [],
  principalOemDetails: '',
  hideClientNames: false,
};

export const initialCompanyProfileData: CompanyProfileData = {
  title: 'My Company Profile',
  template: 'corporate',
  basicInfo: initialBasicInfo,
  legalDetails: initialLegalDetails,
  contactInfo: initialContactInfo,
  management: initialManagement,
  overview: '',
  visionMission: initialVisionMission,
  services: [],
  products: [],
  projects: [],
  clientsPartners: initialClientsPartners,
  certifications: [],
  hseQuality: initialHseQuality,
  themeSettings: initialThemeSettings,
  visibleSections: [
    'basic_info',
    'contact_info',
    'overview',
    'vision_mission',
    'services',
    'projects',
    'certifications',
  ],
};
