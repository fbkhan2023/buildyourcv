import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck } from 'lucide-react';

export const CompanyHseForm = () => {
  const { profileData, updateHseQuality } = useCompanyProfile();
  const { hseQuality } = profileData;

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          HSE & Quality
        </CardTitle>
        <CardDescription>Health, Safety, Environment and Quality policies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="hsePolicy">HSE Policy</Label>
          <Textarea
            id="hsePolicy"
            value={hseQuality.hsePolicy}
            onChange={(e) => updateHseQuality({ hsePolicy: e.target.value })}
            placeholder="Describe your company's HSE policy..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="qualityPolicy">Quality Policy</Label>
          <Textarea
            id="qualityPolicy"
            value={hseQuality.qualityPolicy}
            onChange={(e) => updateHseQuality({ qualityPolicy: e.target.value })}
            placeholder="Describe your company's quality policy..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="safetyStatistics">Safety Statistics (optional)</Label>
          <Textarea
            id="safetyStatistics"
            value={hseQuality.safetyStatistics}
            onChange={(e) => updateHseQuality({ safetyStatistics: e.target.value })}
            placeholder="e.g., 1,000,000 man-hours without LTI..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
};
