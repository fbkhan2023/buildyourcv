import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Users, Plus, Trash2 } from 'lucide-react';

export const CompanyManagementForm = () => {
  const { profileData, updateManagement, addKeyPersonnel, updateKeyPersonnel, removeKeyPersonnel } = useCompanyProfile();
  const { management } = profileData;

  const handleAddPersonnel = () => {
    addKeyPersonnel({
      id: crypto.randomUUID(),
      name: '',
      designation: '',
      department: '',
      yearsOfExperience: '',
      bio: '',
    });
  };

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Management & Organization
        </CardTitle>
        <CardDescription>Add key personnel and organizational structure</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="orgDescription">Organizational Structure Description</Label>
          <Textarea
            id="orgDescription"
            value={management.organizationDescription}
            onChange={(e) => updateManagement({ organizationDescription: e.target.value })}
            placeholder="Describe your company's organizational structure..."
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg">Key Personnel</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddPersonnel}>
              <Plus className="h-4 w-4 mr-1" /> Add Person
            </Button>
          </div>

          {management.keyPersonnel.map((person, index) => (
            <div key={person.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Person {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeKeyPersonnel(person.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={person.name}
                    onChange={(e) => updateKeyPersonnel(person.id, { name: e.target.value })}
                    placeholder="Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input
                    value={person.designation}
                    onChange={(e) => updateKeyPersonnel(person.id, { designation: e.target.value })}
                    placeholder="e.g., CEO, Managing Director"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input
                    value={person.department}
                    onChange={(e) => updateKeyPersonnel(person.id, { department: e.target.value })}
                    placeholder="e.g., Operations, Finance"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Years of Experience</Label>
                  <Input
                    value={person.yearsOfExperience}
                    onChange={(e) => updateKeyPersonnel(person.id, { yearsOfExperience: e.target.value })}
                    placeholder="e.g., 15+"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Short Bio</Label>
                <Textarea
                  value={person.bio}
                  onChange={(e) => updateKeyPersonnel(person.id, { bio: e.target.value })}
                  placeholder="Brief professional bio..."
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
