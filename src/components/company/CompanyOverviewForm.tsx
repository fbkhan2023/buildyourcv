import { useState } from 'react';
import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const tones = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'technical', label: 'Technical' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'tender', label: 'Tender/Prequalification' },
];

export const CompanyOverviewForm = () => {
  const { profileData, updateOverview, updateVisionMission } = useCompanyProfile();
  const { overview, visionMission, basicInfo } = profileData;
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('corporate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coreValueInput, setCoreValueInput] = useState('');

  const generateOverview = async () => {
    if (!keywords.trim()) {
      toast.error('Please enter some keywords');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-company-text', {
        body: {
          type: 'overview',
          keywords,
          tone,
          companyName: basicInfo.legalName || basicInfo.tradeName,
        },
      });

      if (error) throw error;
      if (data?.text) {
        updateOverview(data.text);
        toast.success('Overview generated!');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate overview');
    } finally {
      setIsGenerating(false);
    }
  };

  const addCoreValue = () => {
    if (coreValueInput.trim()) {
      updateVisionMission({
        coreValues: [...(visionMission.coreValues || []), coreValueInput.trim()],
      });
      setCoreValueInput('');
    }
  };

  const removeCoreValue = (index: number) => {
    updateVisionMission({
      coreValues: visionMission.coreValues.filter((_, i) => i !== index),
    });
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Company Overview & Vision
        </CardTitle>
        <CardDescription>Tell the story of your company</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Generator */}
        <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <Label className="text-base font-medium">AI Overview Generator</Label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., oil & gas services, fleet management, Kuwait"
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={generateOverview} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Overview
              </>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="overview">Company Overview</Label>
          <Textarea
            id="overview"
            value={overview}
            onChange={(e) => updateOverview(e.target.value)}
            placeholder="Write a comprehensive overview of your company..."
            rows={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vision">Vision Statement</Label>
          <Textarea
            id="vision"
            value={visionMission.vision}
            onChange={(e) => updateVisionMission({ vision: e.target.value })}
            placeholder="Where do you see your company in the future?"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mission">Mission Statement</Label>
          <Textarea
            id="mission"
            value={visionMission.mission}
            onChange={(e) => updateVisionMission({ mission: e.target.value })}
            placeholder="What is your company's purpose?"
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label>Core Values</Label>
          <div className="flex gap-2">
            <Input
              value={coreValueInput}
              onChange={(e) => setCoreValueInput(e.target.value)}
              placeholder="Add a core value"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCoreValue())}
            />
            <Button type="button" onClick={addCoreValue}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {visionMission.coreValues?.map((value, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
              >
                {value}
                <button
                  type="button"
                  onClick={() => removeCoreValue(index)}
                  className="hover:text-destructive"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
