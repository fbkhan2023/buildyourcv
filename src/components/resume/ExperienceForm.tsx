import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Experience } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Trash2, Briefcase, Building, CalendarIcon, Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const ExperienceForm = () => {
  const { resumeData, addExperience, removeExperience } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({ current: false, achievements: [] });
  const [achievementInput, setAchievementInput] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [aiKeywords, setAiKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAdd = () => {
    if (newExperience.company && newExperience.position) {
      addExperience({
        id: crypto.randomUUID(),
        company: newExperience.company || '',
        position: newExperience.position || '',
        location: newExperience.location || '',
        startDate: startDate ? format(startDate, 'yyyy-MM') : '',
        endDate: newExperience.current ? 'Present' : (endDate ? format(endDate, 'yyyy-MM') : ''),
        current: newExperience.current || false,
        description: newExperience.description || '',
        achievements: newExperience.achievements || [],
      });
      setNewExperience({ current: false, achievements: [] });
      setStartDate(undefined);
      setEndDate(undefined);
      setAiKeywords('');
      setIsAdding(false);
    }
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setNewExperience({
        ...newExperience,
        achievements: [...(newExperience.achievements || []), achievementInput.trim()],
      });
      setAchievementInput('');
    }
  };

  const removeAchievement = (index: number) => {
    setNewExperience({
      ...newExperience,
      achievements: newExperience.achievements?.filter((_, i) => i !== index) || [],
    });
  };

  const generateDescription = async () => {
    if (!aiKeywords.trim()) {
      toast.error('Please enter some keywords for AI generation');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          type: 'experience',
          keywords: aiKeywords,
          context: {
            position: newExperience.position,
            company: newExperience.company,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate text');
      }

      const data = await response.json();
      setNewExperience({ ...newExperience, description: data.text });
      toast.success('Description generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate description');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          Work Experience
        </CardTitle>
        <CardDescription>Add your professional experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing experience entries */}
        {resumeData.experience.map((exp) => (
          <div
            key={exp.id}
            className="rounded-lg border bg-card p-4 space-y-3 animate-scale-in"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-semibold">{exp.position}</h4>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeExperience(exp.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add new experience form */}
        {isAdding ? (
          <div className="rounded-lg border bg-secondary/30 p-4 space-y-4 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Company *</Label>
                <Input
                  placeholder="Google Inc."
                  value={newExperience.company || ''}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Position *</Label>
                <Input
                  placeholder="Software Engineer"
                  value={newExperience.position || ''}
                  onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="Mountain View, CA"
                  value={newExperience.location || ''}
                  onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2 flex items-center gap-2">
                <Checkbox
                  id="current"
                  checked={newExperience.current}
                  onCheckedChange={(checked) =>
                    setNewExperience({ ...newExperience, current: checked as boolean })
                  }
                />
                <Label htmlFor="current" className="cursor-pointer">Currently working here</Label>
              </div>
              {!newExperience.current && (
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "MMM yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
            
            {/* AI Description Generator */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Description Generator
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter keywords (e.g., React, team lead, agile, 50% improvement)"
                  value={aiKeywords}
                  onChange={(e) => setAiKeywords(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={generateDescription}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Generate
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your role and responsibilities..."
                value={newExperience.description || ''}
                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Key Achievements</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add an achievement..."
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                />
                <Button type="button" variant="outline" onClick={addAchievement}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {newExperience.achievements && newExperience.achievements.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {newExperience.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-center justify-between text-sm bg-background rounded p-2">
                      <span>• {achievement}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAchievement(index)}
                        className="h-6 w-6 text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="gradient-primary">
                Add Experience
              </Button>
              <Button variant="outline" onClick={() => { setIsAdding(false); setNewExperience({ current: false, achievements: [] }); setStartDate(undefined); setEndDate(undefined); setAiKeywords(''); }}>
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
            Add Experience
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
