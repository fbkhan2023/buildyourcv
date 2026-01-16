import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Briefcase, CreditCard, CalendarIcon, Car, FileText } from 'lucide-react';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", 
  "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bhutan", "Bolivia", 
  "Bosnia and Herzegovina", "Brazil", "Brunei", "Bulgaria", "Cambodia", "Cameroon", "Canada", 
  "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
  "Denmark", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Estonia", "Ethiopia", 
  "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Honduras", 
  "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Laos", 
  "Latvia", "Lebanon", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Malaysia", 
  "Maldives", "Malta", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", 
  "Morocco", "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "North Korea", 
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Paraguay", "Peru", 
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saudi Arabia", 
  "Senegal", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", 
  "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", 
  "Thailand", "Tunisia", "Turkey", "Turkmenistan", "UAE", "Uganda", "Ukraine", "United Kingdom", 
  "United States", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export const PersonalInfoForm = () => {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;
  
  const [passportExpiry, setPassportExpiry] = useState<Date | undefined>(
    personalInfo.passportExpiry ? parse(personalInfo.passportExpiry, 'yyyy-MM-dd', new Date()) : undefined
  );
  const [idExpiry, setIdExpiry] = useState<Date | undefined>(
    personalInfo.idExpiry ? parse(personalInfo.idExpiry, 'yyyy-MM-dd', new Date()) : undefined
  );

  const fields = [
    { name: 'fullName', label: 'Full Name', icon: User, placeholder: 'John Doe', required: true },
    { name: 'email', label: 'Email', icon: Mail, placeholder: 'john@example.com', type: 'email', required: true },
    { name: 'phone', label: 'Phone', icon: Phone, placeholder: '+1 (555) 123-4567', type: 'tel', required: true },
    { name: 'location', label: 'Location', icon: MapPin, placeholder: 'New York, NY', required: true },
    { name: 'desiredJob', label: 'Desired Position', icon: Briefcase, placeholder: 'Senior Software Engineer', required: true },
    { name: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/johndoe', required: false },
    { name: 'website', label: 'Website/Portfolio', icon: Globe, placeholder: 'johndoe.com', required: false },
  ];

  const handlePassportExpiryChange = (date: Date | undefined) => {
    setPassportExpiry(date);
    updatePersonalInfo('passportExpiry', date ? format(date, 'yyyy-MM-dd') : '');
  };

  const handleIdExpiryChange = (date: Date | undefined) => {
    setIdExpiry(date);
    updatePersonalInfo('idExpiry', date ? format(date, 'yyyy-MM-dd') : '');
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display">Personal Information</CardTitle>
        <CardDescription>Let's start with your basic contact details and desired position</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id={field.name}
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  value={(personalInfo[field.name as keyof typeof personalInfo] as string) || ''}
                  onChange={(e) => updatePersonalInfo(field.name, e.target.value)}
                  className="transition-all duration-200 focus:shadow-glow"
                />
              </div>
            );
          })}
        </div>

        {/* Passport Details */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Passport Details (Optional)
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="passportNumber" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Passport Number
              </Label>
              <Input
                id="passportNumber"
                placeholder="AB1234567"
                value={personalInfo.passportNumber || ''}
                onChange={(e) => updatePersonalInfo('passportNumber', e.target.value)}
                className="transition-all duration-200 focus:shadow-glow"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                Passport Expiry Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !passportExpiry && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {passportExpiry ? format(passportExpiry, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={passportExpiry}
                    onSelect={handlePassportExpiryChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* ID Card Details */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            ID Card Details (Optional)
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="idNumber" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                ID Card Number
              </Label>
              <Input
                id="idNumber"
                placeholder="123-456-789"
                value={personalInfo.idNumber || ''}
                onChange={(e) => updatePersonalInfo('idNumber', e.target.value)}
                className="transition-all duration-200 focus:shadow-glow"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                ID Card Expiry Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !idExpiry && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {idExpiry ? format(idExpiry, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={idExpiry}
                    onSelect={handleIdExpiryChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Driving License */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Driving License (Optional)
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDrivingLicense"
                checked={personalInfo.hasDrivingLicense || false}
                onCheckedChange={(checked) => {
                  updatePersonalInfo('hasDrivingLicense', checked ? 'true' : '');
                  if (!checked) {
                    updatePersonalInfo('drivingLicenseCountry', '');
                  }
                }}
              />
              <Label htmlFor="hasDrivingLicense" className="cursor-pointer">
                I have a valid driving license
              </Label>
            </div>
            
            {personalInfo.hasDrivingLicense && (
              <div className="space-y-2 animate-fade-in">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Issued By Country
                </Label>
                <Select
                  value={personalInfo.drivingLicenseCountry || ''}
                  onValueChange={(value) => updatePersonalInfo('drivingLicenseCountry', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};