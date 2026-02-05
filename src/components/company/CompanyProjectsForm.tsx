import { useState } from 'react';
import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FolderKanban, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Project } from '@/types/companyProfile';

export const CompanyProjectsForm = () => {
  const { profileData, addProject, updateProject, removeProject } = useCompanyProfile();
  const { projects } = profileData;
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleAddProject = () => {
    addProject({
      id: crypto.randomUUID(),
      name: '',
      clientName: '',
      location: '',
      startDate: '',
      endDate: '',
      scopeOfWork: '',
      projectValue: '',
      highlights: [],
      isConfidential: false,
    });
  };

  const handleAddHighlight = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        highlights: [...project.highlights, ''],
      });
    }
  };

  const handleUpdateHighlight = (projectId: string, index: number, value: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      const updated = [...project.highlights];
      updated[index] = value;
      updateProject(projectId, { highlights: updated });
    }
  };

  const handleRemoveHighlight = (projectId: string, index: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, {
        highlights: project.highlights.filter((_, i) => i !== index),
      });
    }
  };

  const generateScope = async (project: Project) => {
    if (!project.name) {
      toast.error('Please enter a project name first');
      return;
    }

    setGeneratingId(project.id);
    try {
      const { data, error } = await supabase.functions.invoke('generate-company-text', {
        body: {
          type: 'project',
          keywords: project.name,
          companyName: profileData.basicInfo.legalName,
        },
      });

      if (error) throw error;
      if (data?.text) {
        updateProject(project.id, { scopeOfWork: data.text });
        toast.success('Scope generated!');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate scope');
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <FolderKanban className="h-6 w-6 text-primary" />
          Projects & Experience
        </CardTitle>
        <CardDescription>Showcase your company's project history</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {projects.map((project, index) => (
          <div key={project.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Project {index + 1}</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`confidential-${project.id}`}
                    checked={project.isConfidential}
                    onCheckedChange={(checked) => updateProject(project.id, { isConfidential: checked })}
                  />
                  <Label htmlFor={`confidential-${project.id}`} className="text-sm">Confidential</Label>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, { name: e.target.value })}
                  placeholder="Project name"
                />
              </div>
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input
                  value={project.clientName}
                  onChange={(e) => updateProject(project.id, { clientName: e.target.value })}
                  placeholder="Client name"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={project.location}
                  onChange={(e) => updateProject(project.id, { location: e.target.value })}
                  placeholder="Project location"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, { startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, { endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project Value (optional)</Label>
              <Input
                value={project.projectValue}
                onChange={(e) => updateProject(project.id, { projectValue: e.target.value })}
                placeholder="e.g., $1,000,000"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Scope of Work</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => generateScope(project)}
                  disabled={generatingId === project.id}
                >
                  {generatingId === project.id ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-1" />
                  )}
                  AI Generate
                </Button>
              </div>
              <Textarea
                value={project.scopeOfWork}
                onChange={(e) => updateProject(project.id, { scopeOfWork: e.target.value })}
                placeholder="Describe the scope of work..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Key Highlights</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddHighlight(project.id)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {project.highlights.map((highlight, hIndex) => (
                <div key={hIndex} className="flex gap-2">
                  <Input
                    value={highlight}
                    onChange={(e) => handleUpdateHighlight(project.id, hIndex, e.target.value)}
                    placeholder="Project highlight"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveHighlight(project.id, hIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={handleAddProject} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </CardContent>
    </Card>
  );
};
