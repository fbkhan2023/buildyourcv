import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Education } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Trash2, GraduationCap, Building2, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const EducationForm = () => {
  const { resumeData, addEducation, removeEducation } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [newEducation, setNewEducation] = useState<Partial<Education>>({});
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleAdd = () => {
    if (newEducation.institution && newEducation.degree) {
      addEducation({
        id: crypto.randomUUID(),
        institution: newEducation.institution || '',
        degree: newEducation.degree || '',
        field: newEducation.field || '',
        startDate: startDate ? format(startDate, 'yyyy-MM') : '',
        endDate: endDate ? format(endDate, 'yyyy-MM') : '',
        gpa: newEducation.gpa,
        description: newEducation.description,
      });
      setNewEducation({});
      setStartDate(undefined);
      setEndDate(undefined);
      setIsAdding(false);
    }
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          Education
        </CardTitle>
        <CardDescription>Add your educational background</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing education entries */}
        {resumeData.education.map((edu) => (
          <div
            key={edu.id}
            className="rounded-lg border bg-card p-4 space-y-3 animate-scale-in"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-semibold">{edu.institution}</h4>
                  <p className="text-sm text-muted-foreground">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeEducation(edu.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add new education form */}
        {isAdding ? (
          <div className="rounded-lg border bg-secondary/30 p-4 space-y-4 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Institution *</Label>
                <Input
                  placeholder="Harvard University"
                  value={newEducation.institution || ''}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Degree *</Label>
                <Input
                  placeholder="Bachelor of Science"
                  value={newEducation.degree || ''}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input
                  placeholder="Computer Science"
                  value={newEducation.field || ''}
                  onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (Optional)</Label>
                <Input
                  placeholder="3.8"
                  value={newEducation.gpa || ''}
                  onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
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
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                placeholder="Relevant coursework, honors, activities..."
                value={newEducation.description || ''}
                onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="gradient-primary">
                Add Education
              </Button>
              <Button variant="outline" onClick={() => { setIsAdding(false); setNewEducation({}); setStartDate(undefined); setEndDate(undefined); }}>
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
            Add Education
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
