import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { CompanyBasicInfoForm } from '@/components/company/CompanyBasicInfoForm';
import { CompanyContactForm } from '@/components/company/CompanyContactForm';
import { CompanyLegalForm } from '@/components/company/CompanyLegalForm';
import { CompanyOverviewForm } from '@/components/company/CompanyOverviewForm';
import { CompanyServicesForm } from '@/components/company/CompanyServicesForm';
import { CompanyProjectsForm } from '@/components/company/CompanyProjectsForm';
import { CompanyCertificationsForm } from '@/components/company/CompanyCertificationsForm';
import { CompanyManagementForm } from '@/components/company/CompanyManagementForm';
import { CompanyHseForm } from '@/components/company/CompanyHseForm';
import { CompanyTemplateSelector } from '@/components/company/CompanyTemplateSelector';
import { CompanyProfilePreview } from '@/components/company/CompanyProfilePreview';
import { CompanyExportButtons } from '@/components/company/CompanyExportButtons';
import { StepIndicator } from '@/components/resume/StepIndicator';
import { useSearchParams } from 'react-router-dom';

const steps = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Contact' },
  { id: 3, name: 'Legal' },
  { id: 4, name: 'Overview' },
  { id: 5, name: 'Services' },
  { id: 6, name: 'Projects' },
  { id: 7, name: 'Certifications' },
  { id: 8, name: 'Management' },
  { id: 9, name: 'HSE' },
  { id: 10, name: 'Template' },
];

const CompanyBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { profileData, loadProfile, setProfileData } = useCompanyProfile();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  useEffect(() => {
    if (editId && user) {
      loadExistingProfile(editId);
    }
  }, [editId, user]);

  const loadExistingProfile = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        loadProfile({
          id: data.id,
          title: data.title,
          template: data.template as any,
          basicInfo: data.basic_info as any,
          legalDetails: data.legal_details as any,
          contactInfo: data.contact_info as any,
          management: data.management as any,
          overview: data.overview || '',
          visionMission: data.vision_mission as any,
          services: data.services as any,
          products: data.products as any,
          projects: data.projects as any,
          clientsPartners: data.clients_partners as any,
          certifications: data.certifications as any,
          hseQuality: data.hse_quality as any,
          themeSettings: data.theme_settings as any,
          visibleSections: data.visible_sections as any,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const saveProfile = async () => {
    if (!user) {
      toast.error('Please sign in to save your profile');
      return;
    }

    setIsSaving(true);
    try {
      const profilePayload: any = {
        user_id: user.id,
        title: profileData.title || profileData.basicInfo.legalName || 'My Company Profile',
        template: profileData.template,
        basic_info: profileData.basicInfo,
        legal_details: profileData.legalDetails,
        contact_info: profileData.contactInfo,
        management: profileData.management,
        overview: profileData.overview,
        vision_mission: profileData.visionMission,
        services: profileData.services,
        products: profileData.products,
        projects: profileData.projects,
        clients_partners: profileData.clientsPartners,
        certifications: profileData.certifications,
        hse_quality: profileData.hseQuality,
        theme_settings: profileData.themeSettings,
        visible_sections: profileData.visibleSections,
      };

      if (profileData.id) {
        const { error } = await supabase
          .from('company_profiles')
          .update(profilePayload)
          .eq('id', profileData.id);
        if (error) throw error;
        toast.success('Profile updated!');
      } else {
        const { data, error } = await supabase
          .from('company_profiles')
          .insert([profilePayload])
          .select()
          .single();
        if (error) throw error;
        if (data) {
          setProfileData(prev => ({ ...prev, id: data.id }));
        }
        toast.success('Profile saved!');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <CompanyBasicInfoForm />;
      case 2: return <CompanyContactForm />;
      case 3: return <CompanyLegalForm />;
      case 4: return <CompanyOverviewForm />;
      case 5: return <CompanyServicesForm />;
      case 6: return <CompanyProjectsForm />;
      case 7: return <CompanyCertificationsForm />;
      case 8: return <CompanyManagementForm />;
      case 9: return <CompanyHseForm />;
      case 10: return <CompanyTemplateSelector />;
      default: return <CompanyBasicInfoForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Company Profile Builder</h1>
            <p className="text-muted-foreground">Create a professional company profile</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="md:hidden"
            >
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button onClick={saveProfile} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>

        <StepIndicator steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />

        <div className="grid gap-6 lg:grid-cols-2 mt-6">
          {/* Form Section */}
          <div className={showPreview ? 'hidden md:block' : ''}>
            {renderStepContent()}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                disabled={currentStep === steps.length}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className={!showPreview ? 'hidden md:block' : ''}>
            <div className="sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Preview</h2>
                <CompanyExportButtons />
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <CompanyProfilePreview />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyBuilder;
