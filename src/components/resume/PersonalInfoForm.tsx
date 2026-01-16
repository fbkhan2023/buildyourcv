import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Briefcase } from 'lucide-react';

export const PersonalInfoForm = () => {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  const fields = [
    { name: 'fullName', label: 'Full Name', icon: User, placeholder: 'John Doe', required: true },
    { name: 'email', label: 'Email', icon: Mail, placeholder: 'john@example.com', type: 'email', required: true },
    { name: 'phone', label: 'Phone', icon: Phone, placeholder: '+1 (555) 123-4567', type: 'tel', required: true },
    { name: 'location', label: 'Location', icon: MapPin, placeholder: 'New York, NY', required: true },
    { name: 'desiredJob', label: 'Desired Position', icon: Briefcase, placeholder: 'Senior Software Engineer', required: true },
    { name: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/johndoe', required: false },
    { name: 'website', label: 'Website/Portfolio', icon: Globe, placeholder: 'johndoe.com', required: false },
  ];

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display">Personal Information</CardTitle>
        <CardDescription>Let's start with your basic contact details and desired position</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id={field.name}
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  value={personalInfo[field.name as keyof typeof personalInfo] || ''}
                  onChange={(e) => updatePersonalInfo(field.name, e.target.value)}
                  className="transition-all duration-200 focus:shadow-glow"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
