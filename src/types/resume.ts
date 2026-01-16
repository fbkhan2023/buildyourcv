export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  desiredJob: string;
  photo?: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  idNumber?: string;
  idExpiry?: string;
  hasDrivingLicense?: boolean;
  drivingLicenseCountry?: string;
  comment?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

export interface ResumeData {
  id?: string;
  title: string;
  template: 'modern' | 'classic' | 'minimal';
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  summary: string;
}

export const initialResumeData: ResumeData = {
  title: 'My Resume',
  template: 'modern',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    desiredJob: '',
    photo: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    passportExpiry: '',
    idNumber: '',
    idExpiry: '',
    hasDrivingLicense: false,
    drivingLicenseCountry: '',
    comment: '',
  },
  education: [],
  experience: [],
  skills: [],
  summary: '',
};
