import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Palette, Check } from 'lucide-react';

const templates = [
  {
    id: 'modern' as const,
    name: 'Modern',
    description: 'Clean and contemporary design with accent colors',
    preview: 'bg-gradient-to-br from-primary/10 to-accent/10',
  },
  {
    id: 'classic' as const,
    name: 'Classic',
    description: 'Traditional professional layout, timeless appeal',
    preview: 'bg-gradient-to-br from-secondary to-muted',
  },
  {
    id: 'minimal' as const,
    name: 'Minimal',
    description: 'Simple and elegant, focuses on content',
    preview: 'bg-gradient-to-br from-background to-secondary/50',
  },
  {
    id: 'executive' as const,
    name: 'Executive',
    description: 'Two-column layout with photo, light blue accents',
    preview: 'bg-gradient-to-br from-sky-100 to-gray-100',
  },
];

export const TemplateSelector = () => {
  const { resumeData, setTemplate } = useResume();

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          Choose Template
        </CardTitle>
        <CardDescription>Select a design that best represents you</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setTemplate(template.id)}
              className={cn(
                'relative rounded-lg border-2 p-4 text-left transition-all duration-300 hover:shadow-elevated',
                resumeData.template === template.id
                  ? 'border-primary shadow-glow'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {resumeData.template === template.id && (
                <div className="absolute -top-2 -right-2 rounded-full bg-primary p-1">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div className={cn('h-32 rounded-md mb-3', template.preview)} />
              <h4 className="font-semibold">{template.name}</h4>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
