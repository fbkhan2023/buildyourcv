import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Phone, Plus, Trash2, Globe, Mail, Linkedin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const CompanyContactForm = () => {
  const { profileData, updateContactInfo } = useCompanyProfile();
  const { contactInfo } = profileData;

  const addPhoneNumber = () => {
    updateContactInfo({
      phoneNumbers: [...contactInfo.phoneNumbers, ''],
    });
  };

  const updatePhoneNumber = (index: number, value: string) => {
    const updated = [...contactInfo.phoneNumbers];
    updated[index] = value;
    updateContactInfo({ phoneNumbers: updated });
  };

  const removePhoneNumber = (index: number) => {
    updateContactInfo({
      phoneNumbers: contactInfo.phoneNumbers.filter((_, i) => i !== index),
    });
  };

  const updateSocialMedia = (platform: string, value: string) => {
    updateContactInfo({
      socialMedia: { ...contactInfo.socialMedia, [platform]: value },
    });
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <Phone className="h-6 w-6 text-primary" />
          Contact Information
        </CardTitle>
        <CardDescription>How can people reach your company?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="officeAddress">Office Address</Label>
          <Input
            id="officeAddress"
            value={contactInfo.officeAddress}
            onChange={(e) => updateContactInfo({ officeAddress: e.target.value })}
            placeholder="Full office address"
          />
        </div>

        {/* Phone Numbers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Phone Numbers</Label>
            <Button type="button" variant="outline" size="sm" onClick={addPhoneNumber}>
              <Plus className="h-4 w-4 mr-1" /> Add Phone
            </Button>
          </div>
          {contactInfo.phoneNumbers.map((phone, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={phone}
                onChange={(e) => updatePhoneNumber(index, e.target.value)}
                placeholder="+1 234 567 8900"
                className="flex-1"
              />
              {contactInfo.phoneNumbers.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePhoneNumber(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Email Addresses */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="emailGeneral" className="flex items-center gap-1">
              <Mail className="h-4 w-4" /> General Email
            </Label>
            <Input
              id="emailGeneral"
              type="email"
              value={contactInfo.emailGeneral}
              onChange={(e) => updateContactInfo({ emailGeneral: e.target.value })}
              placeholder="info@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailSales">Sales Email</Label>
            <Input
              id="emailSales"
              type="email"
              value={contactInfo.emailSales}
              onChange={(e) => updateContactInfo({ emailSales: e.target.value })}
              placeholder="sales@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailSupport">Support Email</Label>
            <Input
              id="emailSupport"
              type="email"
              value={contactInfo.emailSupport}
              onChange={(e) => updateContactInfo({ emailSupport: e.target.value })}
              placeholder="support@company.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="flex items-center gap-1">
            <Globe className="h-4 w-4" /> Website
          </Label>
          <Input
            id="website"
            value={contactInfo.website}
            onChange={(e) => updateContactInfo({ website: e.target.value })}
            placeholder="https://www.company.com"
          />
        </div>

        {/* Social Media */}
        <div className="space-y-3">
          <Label>Social Media Links</Label>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Linkedin className="h-5 w-5 text-[#0A66C2]" />
              <Input
                value={contactInfo.socialMedia.linkedin}
                onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                placeholder="LinkedIn URL"
              />
            </div>
            <div className="flex items-center gap-2">
              <Facebook className="h-5 w-5 text-[#1877F2]" />
              <Input
                value={contactInfo.socialMedia.facebook}
                onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                placeholder="Facebook URL"
              />
            </div>
            <div className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-[#1DA1F2]" />
              <Input
                value={contactInfo.socialMedia.twitter}
                onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                placeholder="X (Twitter) URL"
              />
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-[#E4405F]" />
              <Input
                value={contactInfo.socialMedia.instagram}
                onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                placeholder="Instagram URL"
              />
            </div>
            <div className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-[#FF0000]" />
              <Input
                value={contactInfo.socialMedia.youtube}
                onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                placeholder="YouTube URL"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
