import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ResumeData, initialResumeData, Education, Experience, Skill, Language, Certification } from '@/types/resume';

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  updatePersonalInfo: (field: string, value: string) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Education) => void;
  removeEducation: (id: string) => void;
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Experience) => void;
  removeExperience: (id: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Skill) => void;
  removeSkill: (id: string) => void;
  addLanguage: (language: Language) => void;
  removeLanguage: (id: string) => void;
  addCertification: (certification: Certification) => void;
  updateCertification: (id: string, certification: Certification) => void;
  removeCertification: (id: string) => void;
  updateSummary: (summary: string) => void;
  setTemplate: (template: 'modern' | 'classic' | 'minimal' | 'executive') => void;
  resetResume: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [currentStep, setCurrentStep] = useState(0);

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addEducation = (education: Education) => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, education],
    }));
  };

  const updateEducation = (id: string, education: Education) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(e => (e.id === id ? education : e)),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id),
    }));
  };

  const addExperience = (experience: Experience) => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, experience],
    }));
  };

  const updateExperience = (id: string, experience: Experience) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => (e.id === id ? experience : e)),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id),
    }));
  };

  const addSkill = (skill: Skill) => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  };

  const updateSkill = (id: string, skill: Skill) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s => (s.id === id ? skill : s)),
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));
  };

  const addLanguage = (language: Language) => {
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, language],
    }));
  };

  const removeLanguage = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id),
    }));
  };

  const addCertification = (certification: Certification) => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, certification],
    }));
  };

  const updateCertification = (id: string, certification: Certification) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => (c.id === id ? certification : c)),
    }));
  };

  const removeCertification = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id),
    }));
  };

  const updateSummary = (summary: string) => {
    setResumeData(prev => ({ ...prev, summary }));
  };

  const setTemplate = (template: 'modern' | 'classic' | 'minimal' | 'executive') => {
    setResumeData(prev => ({ ...prev, template }));
  };

  const resetResume = () => {
    setResumeData(initialResumeData);
    setCurrentStep(0);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        updatePersonalInfo,
        addEducation,
        updateEducation,
        removeEducation,
        addExperience,
        updateExperience,
        removeExperience,
        addSkill,
        updateSkill,
        removeSkill,
        addLanguage,
        removeLanguage,
        addCertification,
        updateCertification,
        removeCertification,
        updateSummary,
        setTemplate,
        resetResume,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
