import { useState } from 'react';
import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Service } from '@/types/companyProfile';

export const CompanyServicesForm = () => {
  const { profileData, addService, updateService, removeService } = useCompanyProfile();
  const { services } = profileData;
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleAddService = () => {
    addService({
      id: crypto.randomUUID(),
      category: '',
      title: '',
      description: '',
      keyCapabilities: [],
      imageUrl: '',
    });
  };

  const handleAddCapability = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      updateService(serviceId, {
        keyCapabilities: [...service.keyCapabilities, ''],
      });
    }
  };

  const handleUpdateCapability = (serviceId: string, index: number, value: string) => {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      const updated = [...service.keyCapabilities];
      updated[index] = value;
      updateService(serviceId, { keyCapabilities: updated });
    }
  };

  const handleRemoveCapability = (serviceId: string, index: number) => {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      updateService(serviceId, {
        keyCapabilities: service.keyCapabilities.filter((_, i) => i !== index),
      });
    }
  };

  const generateDescription = async (service: Service) => {
    if (!service.title) {
      toast.error('Please enter a service title first');
      return;
    }

    setGeneratingId(service.id);
    try {
      const { data, error } = await supabase.functions.invoke('generate-company-text', {
        body: {
          type: 'service',
          keywords: service.title,
          companyName: profileData.basicInfo.legalName,
        },
      });

      if (error) throw error;
      if (data?.text) {
        updateService(service.id, { description: data.text });
        toast.success('Description generated!');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate description');
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          Services & Capabilities
        </CardTitle>
        <CardDescription>Describe your company's services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {services.map((service, index) => (
          <div key={service.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Service {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeService(service.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={service.category}
                  onChange={(e) => updateService(service.id, { category: e.target.value })}
                  placeholder="e.g., Consulting, Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={service.title}
                  onChange={(e) => updateService(service.id, { title: e.target.value })}
                  placeholder="Service name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Description</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => generateDescription(service)}
                  disabled={generatingId === service.id}
                >
                  {generatingId === service.id ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-1" />
                  )}
                  AI Generate
                </Button>
              </div>
              <Textarea
                value={service.description}
                onChange={(e) => updateService(service.id, { description: e.target.value })}
                placeholder="Describe this service..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Key Capabilities</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddCapability(service.id)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {service.keyCapabilities.map((cap, capIndex) => (
                <div key={capIndex} className="flex gap-2">
                  <Input
                    value={cap}
                    onChange={(e) => handleUpdateCapability(service.id, capIndex, e.target.value)}
                    placeholder="Capability"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCapability(service.id, capIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={handleAddService} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Service
        </Button>
      </CardContent>
    </Card>
  );
};
