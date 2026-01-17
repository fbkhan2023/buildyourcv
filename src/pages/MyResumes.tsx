import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useResume } from '@/contexts/ResumeContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, FileText, Trash2, Edit, Calendar } from 'lucide-react';
import { ResumeData, initialResumeData } from '@/types/resume';

interface SavedResume {
  id: string;
  title: string;
  template: string;
  personal_info: any;
  education: any;
  experience: any;
  skills: any;
  summary: string;
  created_at: string;
  updated_at: string;
}

const MyResumes = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { setResumeData, resetResume } = useResume();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      return;
    }

    if (user) {
      fetchResumes();
    }
  }, [user, authLoading, navigate]);

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error: any) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    resetResume();
    navigate('/builder');
  };

  const handleEdit = (resume: SavedResume) => {
    setResumeData({
      id: resume.id,
      title: resume.title,
      template: resume.template as ResumeData['template'],
      personalInfo: resume.personal_info,
      education: resume.education,
      experience: resume.experience,
      skills: resume.skills,
      languages: resume.personal_info?.languages || [],
      certifications: resume.personal_info?.certifications || [],
      summary: resume.summary || '',
    });
    navigate('/builder');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const { error } = await supabase.from('resumes').delete().eq('id', id);
      if (error) throw error;
      setResumes(resumes.filter((r) => r.id !== id));
      toast.success('Resume deleted');
    } catch (error: any) {
      toast.error('Failed to delete resume');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">My Resumes</h1>
            <p className="text-muted-foreground">Manage and edit your saved resumes</p>
          </div>
          <Button onClick={handleCreateNew} className="gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            Create New Resume
          </Button>
        </div>

        {resumes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-4">Create your first resume to get started</p>
              <Button onClick={handleCreateNew} className="gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <Card
                key={resume.id}
                className="shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer"
                onClick={() => handleEdit(resume)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="gradient-primary rounded p-2">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-lg">{resume.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">
                    {resume.personal_info?.fullName || 'No name set'}
                    {resume.personal_info?.desiredJob && (
                      <span className="block text-xs mt-1">{resume.personal_info.desiredJob}</span>
                    )}
                  </CardDescription>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Updated {formatDate(resume.updated_at)}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(resume);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(resume.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyResumes;
