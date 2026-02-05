import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Palette, Check } from 'lucide-react';
import { CompanyProfileTemplate } from '@/types/companyProfile';

const templates: { id: CompanyProfileTemplate; name: string; description: string; preview: string }[] = [
  {
    id: 'corporate',
    name: 'Corporate Classic',
    description: 'Traditional corporate style, professional and formal',
    preview: 'bg-gradient-to-br from-slate-700 to-slate-900',
  },
  {
    id: 'modern',
    name: 'Modern Business',
    description: 'Clean contemporary design with accent colors',
    preview: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Bold design for engineering & manufacturing',
    preview: 'bg-gradient-to-br from-amber-500 to-orange-600',
  },
  {
    id: 'tender',
    name: 'Tender / PQ',
    description: 'Prequalification & tender-friendly format',
    preview: 'bg-gradient-to-br from-gray-600 to-gray-800',
  },
  {
    id: 'brochure',
    name: 'Marketing Brochure',
    description: 'Eye-catching brochure style layout',
    preview: 'bg-gradient-to-br from-purple-500 to-pink-500',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple text-focused design',
    preview: 'bg-gradient-to-br from-gray-100 to-gray-300',
  },
];

export const CompanyTemplateSelector = () => {
  const { profileData, setTemplate } = useCompanyProfile();

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          Choose Template
        </CardTitle>
        <CardDescription>Select a design that represents your company</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setTemplate(template.id)}
              className={cn(
                'relative rounded-lg border-2 p-4 text-left transition-all duration-300 hover:shadow-elevated',
                profileData.template === template.id
                  ? 'border-primary shadow-glow'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {profileData.template === template.id && (
                <div className="absolute -top-2 -right-2 rounded-full bg-primary p-1">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div className={cn('h-24 rounded-md mb-3', template.preview)} />
              <h4 className="font-semibold">{template.name}</h4>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
