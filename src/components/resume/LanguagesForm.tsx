import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Language } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Languages } from 'lucide-react';

const proficiencyColors = {
  basic: 'bg-muted text-muted-foreground',
  conversational: 'bg-secondary text-secondary-foreground',
  professional: 'bg-primary/20 text-primary',
  fluent: 'bg-accent/20 text-accent',
  native: 'bg-accent text-accent-foreground',
};

const proficiencyLabels = {
  basic: 'Basic',
  conversational: 'Conversational',
  professional: 'Professional Working',
  fluent: 'Fluent',
  native: 'Native/Bilingual',
};

export const LanguagesForm = () => {
  const { resumeData, addLanguage, removeLanguage } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [newLanguage, setNewLanguage] = useState<Partial<Language>>({ proficiency: 'professional' });

  const handleAdd = () => {
    if (newLanguage.name) {
      addLanguage({
        id: crypto.randomUUID(),
        name: newLanguage.name,
        proficiency: newLanguage.proficiency as Language['proficiency'] || 'professional',
      });
      setNewLanguage({ proficiency: 'professional' });
      setIsAdding(false);
    }
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <Languages className="h-6 w-6 text-primary" />
          Languages
        </CardTitle>
        <CardDescription>Add languages you speak</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing languages */}
        {resumeData.languages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resumeData.languages.map((lang) => (
              <Badge
                key={lang.id}
                variant="outline"
                className={`${proficiencyColors[lang.proficiency]} px-3 py-1.5 text-sm animate-scale-in`}
              >
                {lang.name} - {proficiencyLabels[lang.proficiency]}
                <button
                  onClick={() => removeLanguage(lang.id)}
                  className="ml-2 hover:text-destructive transition-colors"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Add new language form */}
        {isAdding ? (
          <div className="rounded-lg border bg-secondary/30 p-4 space-y-4 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Language *</Label>
                <Input
                  placeholder="English, Arabic, French..."
                  value={newLanguage.name || ''}
                  onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Proficiency Level</Label>
                <Select
                  value={newLanguage.proficiency}
                  onValueChange={(value) => setNewLanguage({ ...newLanguage, proficiency: value as Language['proficiency'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="professional">Professional Working</SelectItem>
                    <SelectItem value="fluent">Fluent</SelectItem>
                    <SelectItem value="native">Native/Bilingual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="gradient-primary">
                Add Language
              </Button>
              <Button variant="outline" onClick={() => { setIsAdding(false); setNewLanguage({ proficiency: 'professional' }); }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="w-full border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Language
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
