import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Award, Plus, Trash2, Upload, X, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export const CompanyCertificationsForm = () => {
  const { profileData, addCertification, updateCertification, removeCertification } = useCompanyProfile();
  const { certifications } = profileData;
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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

  const handleFileUpload = (certId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCertification(certId, { certificateUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (certId: string) => {
    updateCertification(certId, { certificateUrl: '' });
  };

  const certificatesWithFiles = certifications.filter(cert => cert.certificateUrl);

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
        {/* Certificate Slides Preview */}
        {certificatesWithFiles.length > 0 && (
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Uploaded Certificates</Label>
            <div className="px-12">
              <Carousel className="w-full">
                <CarouselContent>
                  {certificatesWithFiles.map((cert) => (
                    <CarouselItem key={cert.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-2">
                        <div className="relative group rounded-lg border bg-muted/30 overflow-hidden aspect-[4/3] flex items-center justify-center">
                          {cert.certificateUrl.startsWith('data:image') ? (
                            <img
                              src={cert.certificateUrl}
                              alt={cert.name || 'Certificate'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground p-4">
                              <FileText className="h-12 w-12" />
                              <span className="text-xs text-center truncate max-w-full">
                                {cert.name || 'Certificate'}
                              </span>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2 text-center">
                            <p className="text-xs font-medium truncate">{cert.name || 'Untitled'}</p>
                            {cert.issuingAuthority && (
                              <p className="text-xs text-muted-foreground truncate">{cert.issuingAuthority}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        )}

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

            {/* Certificate Upload */}
            <div className="space-y-2">
              <Label>Upload Certificate</Label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={(el) => (fileInputRefs.current[cert.id] = el)}
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(cert.id, e)}
                />
                {cert.certificateUrl ? (
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md flex-1">
                      {cert.certificateUrl.startsWith('data:image') ? (
                        <img
                          src={cert.certificateUrl}
                          alt="Certificate preview"
                          className="h-8 w-8 object-cover rounded"
                        />
                      ) : (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="text-sm text-muted-foreground truncate">
                        Certificate uploaded
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(cert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRefs.current[cert.id]?.click()}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Certificate (Image/PDF)
                  </Button>
                )}
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
