import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FileText, Calendar } from 'lucide-react';

export const CompanyLegalForm = () => {
  const { profileData, updateLegalDetails } = useCompanyProfile();
  const { legalDetails } = profileData;

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Registration & Legal Details
        </CardTitle>
        <CardDescription>Official registration and compliance information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="commercialRegNumber">Commercial Registration Number</Label>
            <Input
              id="commercialRegNumber"
              value={legalDetails.commercialRegNumber}
              onChange={(e) => updateLegalDetails({ commercialRegNumber: e.target.value })}
              placeholder="CR Number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regIssuingAuthority">Issuing Authority</Label>
            <Input
              id="regIssuingAuthority"
              value={legalDetails.regIssuingAuthority}
              onChange={(e) => updateLegalDetails({ regIssuingAuthority: e.target.value })}
              placeholder="Ministry of Commerce"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfRegistration">Date of Registration</Label>
          <Input
            id="dateOfRegistration"
            type="date"
            value={legalDetails.dateOfRegistration}
            onChange={(e) => updateLegalDetails({ dateOfRegistration: e.target.value })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              value={legalDetails.licenseNumber}
              onChange={(e) => updateLegalDetails({ licenseNumber: e.target.value })}
              placeholder="License #"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseIssueDate">License Issue Date</Label>
            <Input
              id="licenseIssueDate"
              type="date"
              value={legalDetails.licenseIssueDate}
              onChange={(e) => updateLegalDetails({ licenseIssueDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
            <Input
              id="licenseExpiryDate"
              type="date"
              value={legalDetails.licenseExpiryDate}
              onChange={(e) => updateLegalDetails({ licenseExpiryDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxNumber">Tax / VAT Number</Label>
          <Input
            id="taxNumber"
            value={legalDetails.taxNumber}
            onChange={(e) => updateLegalDetails({ taxNumber: e.target.value })}
            placeholder="VAT Registration Number"
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label htmlFor="chamberOfCommerce" className="text-base">Chamber of Commerce Membership</Label>
            <p className="text-sm text-muted-foreground">Is your company a member?</p>
          </div>
          <Switch
            id="chamberOfCommerce"
            checked={legalDetails.chamberOfCommerce}
            onCheckedChange={(checked) => updateLegalDetails({ chamberOfCommerce: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
};
