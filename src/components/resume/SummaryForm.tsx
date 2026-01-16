import { useResume } from '@/contexts/ResumeContext';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

export const SummaryForm = () => {
  const { resumeData, updateSummary } = useResume();

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
