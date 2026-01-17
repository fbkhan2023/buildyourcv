import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Certification } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';
import { Plus, Trash2, Award, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CertificationsForm = () => {
  const { resumeData, addCertification, updateCertification, removeCertification } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [newCert, setNewCert] = useState<Partial<Certification>>({});

  const handleAdd = () => {
    if (newCert.name && newCert.issuer) {
      addCertification({
        id: crypto.randomUUID(),
        name: newCert.name,
        issuer: newCert.issuer,
        issueDate: newCert.issueDate || '',
        expiryDate: newCert.expiryDate,
        credentialId: newCert.credentialId,
      });
      setNewCert({});
      setIsAdding(false);
    }
  };

  const handleDateChange = (field: 'issueDate' | 'expiryDate', date: Date | undefined) => {
    if (date) {
      setNewCert({ ...newCert, [field]: format(date, 'yyyy-MM-dd') });
    }
  };

  const parseDate = (dateStr: string | undefined) => {
    if (!dateStr) return undefined;
    try {
      return parse(dateStr, 'yyyy-MM-dd', new Date());
    } catch {
      return undefined;
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = parse(dateStr, 'yyyy-MM-dd', new Date());
      return format(date, 'MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          Certifications
        </CardTitle>
        <CardDescription>Add your professional certifications and licenses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing certifications */}
        {resumeData.certifications.map((cert) => (
          <div
            key={cert.id}
            className="rounded-lg border p-4 space-y-2 animate-fade-in"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-foreground">{cert.name}</h4>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                {cert.issueDate && (
                  <p className="text-xs text-muted-foreground">
                    Issued: {formatDisplayDate(cert.issueDate)}
                    {cert.expiryDate && ` • Expires: ${formatDisplayDate(cert.expiryDate)}`}
                  </p>
                )}
                {cert.credentialId && (
                  <p className="text-xs text-muted-foreground">
                    Credential ID: {cert.credentialId}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCertification(cert.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add new certification form */}
        {isAdding ? (
          <div className="rounded-lg border bg-secondary/30 p-4 space-y-4 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Certification Name *</Label>
                <Input
                  placeholder="AWS Solutions Architect, PMP..."
                  value={newCert.name || ''}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Issuing Organization *</Label>
                <Input
                  placeholder="Amazon, PMI, Google..."
                  value={newCert.issuer || ''}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !newCert.issueDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newCert.issueDate ? formatDisplayDate(newCert.issueDate) : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(newCert.issueDate)}
                      onSelect={(date) => handleDateChange('issueDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Expiry Date (optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !newCert.expiryDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newCert.expiryDate ? formatDisplayDate(newCert.expiryDate) : 'No expiry'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(newCert.expiryDate)}
                      onSelect={(date) => handleDateChange('expiryDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Credential ID (optional)</Label>
                <Input
                  placeholder="ABC123..."
                  value={newCert.credentialId || ''}
                  onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="gradient-primary">
                Add Certification
              </Button>
              <Button variant="outline" onClick={() => { setIsAdding(false); setNewCert({}); }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="w-full border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Certification
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
