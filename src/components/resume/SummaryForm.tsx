import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const SummaryForm = () => {
  const { resumeData, updateSummary } = useResume();
  const [aiKeywords, setAiKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    if (!aiKeywords.trim()) {
      toast.error('Please enter some keywords for AI generation');
      return;
    }

    setIsGenerating(true);
    try {
      // Get experience highlights for context
      const experienceHighlights = resumeData.experience
        .slice(0, 3)
        .map(exp => `${exp.position} at ${exp.company}`)
        .join(', ');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          type: 'summary',
          keywords: aiKeywords,
          context: {
            desiredJob: resumeData.personalInfo.desiredJob,
            experience: experienceHighlights,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate text');
      }

      const data = await response.json();
      updateSummary(data.text);
      toast.success('Summary generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Professional Summary
        </CardTitle>
        <CardDescription>
          Write a compelling summary that highlights your key qualifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Summary Generator */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Summary Generator
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter keywords (e.g., 5 years experience, Python, leadership, startup)"
              value={aiKeywords}
              onChange={(e) => setAiKeywords(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={generateSummary}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter keywords about your skills and experience for AI to generate a professional summary
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            placeholder="Passionate software engineer with 5+ years of experience building scalable web applications. Skilled in React, Node.js, and cloud technologies. Proven track record of delivering high-quality products and leading cross-functional teams..."
            value={resumeData.summary}
            onChange={(e) => updateSummary(e.target.value)}
            className="min-h-[200px] transition-all duration-200 focus:shadow-glow"
          />
          <p className="text-xs text-muted-foreground">
            {resumeData.summary.length}/500 characters recommended
          </p>
        </div>
        
        <div className="rounded-lg bg-secondary/50 p-4">
          <h4 className="text-sm font-medium mb-2">Tips for a great summary:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Keep it concise (3-5 sentences)</li>
            <li>• Lead with your years of experience and key expertise</li>
            <li>• Mention 2-3 top skills relevant to your desired role</li>
            <li>• Include a notable achievement if possible</li>
            <li>• Tailor it to the job you're applying for</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
