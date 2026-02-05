import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Award, Plus, Trash2 } from 'lucide-react';

export const CompanyCertificationsForm = () => {
  const { profileData, addCertification, updateCertification, removeCertification } = useCompanyProfile();
  const { certifications } = profileData;

  const handleAddCertification = () => {
    addCertification({
      id: crypto.randomUUID(),
      name: '',
      issuingAuthority: '',
      issueDate: '',
      expiryDate: '',
      certificateUrl: '',
      isSafetyApproval: false,
    });
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          Certifications & Approvals
        </CardTitle>
        <CardDescription>Add your company's certifications and compliance approvals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {certifications.map((cert, index) => (
          <div key={cert.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Certification {index + 1}</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`safety-${cert.id}`}
                    checked={cert.isSafetyApproval}
                    onCheckedChange={(checked) => updateCertification(cert.id, { isSafetyApproval: checked })}
                  />
                  <Label htmlFor={`safety-${cert.id}`} className="text-sm">Safety/Gov Approval</Label>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertification(cert.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Certification Name</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                  placeholder="e.g., ISO 9001:2015"
                />
              </div>
              <div className="space-y-2">
                <Label>Issuing Authority</Label>
                <Input
                  value={cert.issuingAuthority}
                  onChange={(e) => updateCertification(cert.id, { issuingAuthority: e.target.value })}
                  placeholder="e.g., Bureau Veritas"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Input
                  type="date"
                  value={cert.issueDate}
                  onChange={(e) => updateCertification(cert.id, { issueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={cert.expiryDate}
                  onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={handleAddCertification} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Certification
        </Button>
      </CardContent>
    </Card>
  );
};
