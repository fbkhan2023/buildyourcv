import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Skill } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Lightbulb } from 'lucide-react';

const skillLevelColors = {
  beginner: 'bg-muted text-muted-foreground',
  intermediate: 'bg-secondary text-secondary-foreground',
  advanced: 'bg-primary/20 text-primary',
  expert: 'bg-accent text-accent-foreground',
};

export const SkillsForm = () => {
  const { resumeData, addSkill, removeSkill } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({ level: 'intermediate' });

  const handleAdd = () => {
    if (newSkill.name) {
      addSkill({
        id: crypto.randomUUID(),
        name: newSkill.name || '',
        level: newSkill.level as Skill['level'] || 'intermediate',
        category: newSkill.category || 'General',
      });
      setNewSkill({ level: 'intermediate' });
      setIsAdding(false);
    }
  };

  // Group skills by category
  const groupedSkills = resumeData.skills.reduce((acc, skill) => {
    const category = skill.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          Skills
        </CardTitle>
        <CardDescription>Add your technical and soft skills</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing skills grouped by category */}
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant="outline"
                  className={`${skillLevelColors[skill.level]} px-3 py-1.5 text-sm animate-scale-in`}
                >
                  {skill.name}
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="ml-2 hover:text-destructive transition-colors"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        ))}

        {/* Add new skill form */}
        {isAdding ? (
          <div className="rounded-lg border bg-secondary/30 p-4 space-y-4 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Skill Name *</Label>
                <Input
                  placeholder="React, Python, Leadership..."
                  value={newSkill.name || ''}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  placeholder="Programming, Soft Skills..."
                  value={newSkill.category || ''}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Level</Label>
                <Select
                  value={newSkill.level}
                  onValueChange={(value) => setNewSkill({ ...newSkill, level: value as Skill['level'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="gradient-primary">
                Add Skill
              </Button>
              <Button variant="outline" onClick={() => { setIsAdding(false); setNewSkill({ level: 'intermediate' }); }}>
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
            Add Skill
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
