import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '@/contexts/ResumeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { StepIndicator } from '@/components/resume/StepIndicator';
import { PersonalInfoForm } from '@/components/resume/PersonalInfoForm';
import { EducationForm } from '@/components/resume/EducationForm';
import { ExperienceForm } from '@/components/resume/ExperienceForm';
import { SkillsForm } from '@/components/resume/SkillsForm';
import { SummaryForm } from '@/components/resume/SummaryForm';
import { TemplateSelector } from '@/components/resume/TemplateSelector';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useReactToPrint } from 'react-to-print';
import { User, GraduationCap, Briefcase, Lightbulb, FileText, Palette, ChevronLeft, ChevronRight, Printer, Save, Eye } from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';

const steps = [
  { label: 'Personal', icon: <User className="h-5 w-5" /> },
  { label: 'Education', icon: <GraduationCap className="h-5 w-5" /> },
  { label: 'Experience', icon: <Briefcase className="h-5 w-5" /> },
  { label: 'Skills', icon: <Lightbulb className="h-5 w-5" /> },
  { label: 'Summary', icon: <FileText className="h-5 w-5" /> },
  { label: 'Template', icon: <Palette className="h-5 w-5" /> },
];

const Builder = () => {
  const navigate = useNavigate();
  const { resumeData, currentStep, setCurrentStep, setResumeData } = useResume();
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: resumeData.title || 'My Resume',
  });

  const handleSave = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSaving(true);
    try {
      const resumePayload = {
        user_id: user.id,
        title: resumeData.title,
        template: resumeData.template,
        personal_info: resumeData.personalInfo as any,
        education: resumeData.education as any,
        experience: resumeData.experience as any,
        skills: resumeData.skills as any,
        summary: resumeData.summary,
      };

      if (resumeData.id) {
        const { error } = await supabase
          .from('resumes')
          .update(resumePayload)
          .eq('id', resumeData.id);
        if (error) throw error;
        toast.success('Resume updated successfully!');
      } else {
        const { data, error } = await supabase
          .from('resumes')
          .insert([resumePayload])
          .select()
          .single();
        if (error) throw error;
        setResumeData({ ...resumeData, id: data.id });
        toast.success('Resume saved successfully!');
      }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoForm />;
      case 1:
        return <EducationForm />;
      case 2:
        return <ExperienceForm />;
      case 3:
        return <SkillsForm />;
      case 4:
        return <SummaryForm />;
      case 5:
        return <TemplateSelector />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Build Your Resume</h1>
          <p className="text-muted-foreground">Follow the steps to create a professional resume</p>
        </div>

        <div className="no-print">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <div className="no-print space-y-6">
            {renderStep()}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="lg:hidden"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {showPreview ? 'Hide' : 'Preview'}
                </Button>

                {currentStep === steps.length - 1 ? (
                  <>
                    <Button variant="outline" onClick={handleSave} disabled={saving}>
                      <Save className="mr-2 h-4 w-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button onClick={() => handlePrint()} className="gradient-primary">
                      <Printer className="mr-2 h-4 w-4" />
                      Print Resume
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    className="gradient-primary"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className={`${showPreview ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-24">
              <h3 className="text-lg font-semibold mb-4 no-print">Live Preview</h3>
              <div className="overflow-auto max-h-[calc(100vh-200px)] rounded-lg" ref={printRef}>
                <ResumePreview />
              </div>
            </div>
          </div>
        </div>
      </main>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Builder;
