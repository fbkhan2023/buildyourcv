import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Plus, Trash2, Upload } from 'lucide-react';

const companyTypes = [
  'LLC', 'WLL', 'Sole Proprietorship', 'Partnership', 'Branch', 
  'Joint Venture', 'Corporation', 'Public Limited Company', 'Private Limited Company'
];

const companySizes = ['1-10', '11-50', '51-200', '200+'];

const industries = [
  'Oil & Gas', 'Construction', 'Manufacturing', 'Technology', 'Healthcare',
  'Finance', 'Retail', 'Transportation', 'Education', 'Real Estate',
  'Telecommunications', 'Energy', 'Agriculture', 'Hospitality', 'Other'
];

export const CompanyBasicInfoForm = () => {
  const { profileData, updateBasicInfo } = useCompanyProfile();
  const { basicInfo } = profileData;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBasicInfo({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addBranch = () => {
    updateBasicInfo({
      branchLocations: [
        ...basicInfo.branchLocations,
        { id: crypto.randomUUID(), country: '', city: '' },
      ],
    });
  };

  const updateBranch = (id: string, field: 'country' | 'city', value: string) => {
    updateBasicInfo({
      branchLocations: basicInfo.branchLocations.map((b) =>
        b.id === id ? { ...b, [field]: value } : b
      ),
    });
  };

  const removeBranch = (id: string) => {
    updateBasicInfo({
      branchLocations: basicInfo.branchLocations.filter((b) => b.id !== id),
    });
  };

  const toggleIndustry = (industry: string) => {
    const current = basicInfo.industrySectors || [];
    updateBasicInfo({
      industrySectors: current.includes(industry)
        ? current.filter((i) => i !== industry)
        : [...current, industry],
    });
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Basic Information
        </CardTitle>
        <CardDescription>Enter your company's fundamental details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logo Upload */}
        <div className="space-y-2">
          <Label>Company Logo</Label>
          <div className="flex items-center gap-4">
            {basicInfo.logo ? (
              <img src={basicInfo.logo} alt="Logo" className="h-20 w-20 object-contain border rounded" />
            ) : (
              <div className="h-20 w-20 border-2 border-dashed rounded flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="legalName">Legal Name *</Label>
            <Input
              id="legalName"
              value={basicInfo.legalName}
              onChange={(e) => updateBasicInfo({ legalName: e.target.value })}
              placeholder="Company Legal Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tradeName">Trade Name</Label>
            <Input
              id="tradeName"
              value={basicInfo.tradeName}
              onChange={(e) => updateBasicInfo({ tradeName: e.target.value })}
              placeholder="Trade Name (if different)"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slogan">Slogan / Tagline</Label>
          <Input
            id="slogan"
            value={basicInfo.slogan}
            onChange={(e) => updateBasicInfo({ slogan: e.target.value })}
            placeholder="Your company slogan"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="yearEstablished">Year Established</Label>
            <Input
              id="yearEstablished"
              value={basicInfo.yearEstablished}
              onChange={(e) => updateBasicInfo({ yearEstablished: e.target.value })}
              placeholder="2000"
            />
          </div>
          <div className="space-y-2">
            <Label>Company Type</Label>
            <Select
              value={basicInfo.companyType}
              onValueChange={(value) => updateBasicInfo({ companyType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {companyTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Company Size</Label>
            <Select
              value={basicInfo.companySize}
              onValueChange={(value) => updateBasicInfo({ companySize: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map((size) => (
                  <SelectItem key={size} value={size}>{size} employees</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Industry / Sector (select multiple)</Label>
          <div className="flex flex-wrap gap-2">
            {industries.map((industry) => (
              <Button
                key={industry}
                type="button"
                variant={basicInfo.industrySectors?.includes(industry) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleIndustry(industry)}
              >
                {industry}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="hqCountry">Headquarters Country</Label>
            <Input
              id="hqCountry"
              value={basicInfo.headquartersCountry}
              onChange={(e) => updateBasicInfo({ headquartersCountry: e.target.value })}
              placeholder="Country"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hqCity">Headquarters City</Label>
            <Input
              id="hqCity"
              value={basicInfo.headquartersCity}
              onChange={(e) => updateBasicInfo({ headquartersCity: e.target.value })}
              placeholder="City"
            />
          </div>
        </div>

        {/* Branch Locations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Branch Locations</Label>
            <Button type="button" variant="outline" size="sm" onClick={addBranch}>
              <Plus className="h-4 w-4 mr-1" /> Add Branch
            </Button>
          </div>
          {basicInfo.branchLocations.map((branch) => (
            <div key={branch.id} className="flex gap-2 items-center">
              <Input
                value={branch.country}
                onChange={(e) => updateBranch(branch.id, 'country', e.target.value)}
                placeholder="Country"
                className="flex-1"
              />
              <Input
                value={branch.city}
                onChange={(e) => updateBranch(branch.id, 'city', e.target.value)}
                placeholder="City"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBranch(branch.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
