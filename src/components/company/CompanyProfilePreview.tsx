import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { cn } from '@/lib/utils';
import { Building2, Phone, Mail, Globe, MapPin, Calendar, Users, Briefcase, Award, ShieldCheck, Target, Eye, Heart } from 'lucide-react';

export const CompanyProfilePreview = () => {
  const { profileData } = useCompanyProfile();
  const { 
    basicInfo, 
    contactInfo, 
    overview, 
    visionMission, 
    services, 
    projects, 
    certifications, 
    management,
    hseQuality,
    template,
    visibleSections 
  } = profileData;

  const isVisible = (section: string) => visibleSections.includes(section);

  const getTemplateStyles = () => {
    switch (template) {
      case 'corporate':
        return {
          header: 'bg-slate-800 text-white',
          accent: 'text-slate-700',
          sectionBg: 'bg-slate-50',
        };
      case 'modern':
        return {
          header: 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white',
          accent: 'text-blue-600',
          sectionBg: 'bg-blue-50',
        };
      case 'industrial':
        return {
          header: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
          accent: 'text-amber-600',
          sectionBg: 'bg-amber-50',
        };
      case 'tender':
        return {
          header: 'bg-gray-700 text-white',
          accent: 'text-gray-700',
          sectionBg: 'bg-gray-50',
        };
      case 'brochure':
        return {
          header: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
          accent: 'text-purple-600',
          sectionBg: 'bg-purple-50',
        };
      case 'minimal':
        return {
          header: 'bg-white text-gray-900 border-b-2 border-gray-200',
          accent: 'text-gray-800',
          sectionBg: 'bg-white',
        };
      default:
        return {
          header: 'bg-slate-800 text-white',
          accent: 'text-slate-700',
          sectionBg: 'bg-slate-50',
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div id="company-profile-preview" className="bg-white shadow-lg rounded-lg overflow-hidden text-sm">
      {/* Header */}
      <div className={cn('px-8 py-6', styles.header)}>
        <div className="flex items-center gap-6">
          {basicInfo.logo && (
            <img 
              src={basicInfo.logo} 
              alt="Company Logo" 
              className="h-20 w-20 object-contain bg-white rounded p-1"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {basicInfo.legalName || 'Company Name'}
            </h1>
            {basicInfo.tradeName && basicInfo.tradeName !== basicInfo.legalName && (
              <p className="opacity-80">Trading as: {basicInfo.tradeName}</p>
            )}
            {basicInfo.slogan && (
              <p className="italic opacity-90 mt-1">{basicInfo.slogan}</p>
            )}
          </div>
        </div>
        
        {/* Quick Info */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm opacity-90">
          {basicInfo.yearEstablished && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Est. {basicInfo.yearEstablished}
            </span>
          )}
          {basicInfo.headquartersCity && basicInfo.headquartersCountry && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {basicInfo.headquartersCity}, {basicInfo.headquartersCountry}
            </span>
          )}
          {basicInfo.companyType && (
            <span>{basicInfo.companyType}</span>
          )}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Contact Info */}
        {isVisible('contact_info') && (contactInfo.emailGeneral || contactInfo.phoneNumbers[0] || contactInfo.website) && (
          <div className="flex flex-wrap gap-6 text-sm border-b pb-4">
            {contactInfo.emailGeneral && (
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-muted-foreground" /> {contactInfo.emailGeneral}
              </span>
            )}
            {contactInfo.phoneNumbers[0] && (
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4 text-muted-foreground" /> {contactInfo.phoneNumbers[0]}
              </span>
            )}
            {contactInfo.website && (
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-muted-foreground" /> {contactInfo.website}
              </span>
            )}
          </div>
        )}

        {/* Company Overview */}
        {isVisible('overview') && overview && (
          <section>
            <h2 className={cn('text-lg font-bold mb-2 flex items-center gap-2', styles.accent)}>
              <Building2 className="h-5 w-5" /> About Us
            </h2>
            <p className="text-muted-foreground whitespace-pre-line">{overview}</p>
          </section>
        )}

        {/* Vision, Mission, Values */}
        {isVisible('vision_mission') && (visionMission.vision || visionMission.mission || visionMission.coreValues?.length > 0) && (
          <section className={cn('p-4 rounded-lg', styles.sectionBg)}>
            <div className="grid gap-4 md:grid-cols-3">
              {visionMission.vision && (
                <div>
                  <h3 className={cn('font-bold flex items-center gap-1', styles.accent)}>
                    <Eye className="h-4 w-4" /> Vision
                  </h3>
                  <p className="text-sm mt-1">{visionMission.vision}</p>
                </div>
              )}
              {visionMission.mission && (
                <div>
                  <h3 className={cn('font-bold flex items-center gap-1', styles.accent)}>
                    <Target className="h-4 w-4" /> Mission
                  </h3>
                  <p className="text-sm mt-1">{visionMission.mission}</p>
                </div>
              )}
              {visionMission.coreValues?.length > 0 && (
                <div>
                  <h3 className={cn('font-bold flex items-center gap-1', styles.accent)}>
                    <Heart className="h-4 w-4" /> Core Values
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {visionMission.coreValues.map((value, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white rounded text-xs border">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Services */}
        {isVisible('services') && services.length > 0 && (
          <section>
            <h2 className={cn('text-lg font-bold mb-3 flex items-center gap-2', styles.accent)}>
              <Briefcase className="h-5 w-5" /> Services & Capabilities
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <div key={service.id} className={cn('p-3 rounded-lg', styles.sectionBg)}>
                  <h4 className="font-semibold">{service.title}</h4>
                  {service.category && (
                    <span className="text-xs text-muted-foreground">{service.category}</span>
                  )}
                  {service.description && (
                    <p className="text-sm mt-1">{service.description}</p>
                  )}
                  {service.keyCapabilities?.length > 0 && (
                    <ul className="text-xs mt-2 space-y-1">
                      {service.keyCapabilities.map((cap, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-primary">•</span> {cap}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {isVisible('projects') && projects.length > 0 && (
          <section>
            <h2 className={cn('text-lg font-bold mb-3 flex items-center gap-2', styles.accent)}>
              <Briefcase className="h-5 w-5" /> Projects & Experience
            </h2>
            <div className="space-y-3">
              {projects.filter(p => !p.isConfidential).map((project) => (
                <div key={project.id} className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">{project.name}</h4>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
                    {project.clientName && <span>Client: {project.clientName}</span>}
                    {project.location && <span>• {project.location}</span>}
                    {project.startDate && (
                      <span>• {project.startDate} - {project.endDate || 'Present'}</span>
                    )}
                  </div>
                  {project.scopeOfWork && (
                    <p className="text-sm mt-1">{project.scopeOfWork}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Personnel */}
        {isVisible('management') && management.keyPersonnel.length > 0 && (
          <section>
            <h2 className={cn('text-lg font-bold mb-3 flex items-center gap-2', styles.accent)}>
              <Users className="h-5 w-5" /> Key Personnel
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {management.keyPersonnel.map((person) => (
                <div key={person.id} className={cn('p-3 rounded-lg', styles.sectionBg)}>
                  <h4 className="font-semibold">{person.name}</h4>
                  <p className="text-sm text-muted-foreground">{person.designation}</p>
                  {person.yearsOfExperience && (
                    <span className="text-xs">{person.yearsOfExperience} years experience</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {isVisible('certifications') && certifications.length > 0 && (
          <section>
            <h2 className={cn('text-lg font-bold mb-3 flex items-center gap-2', styles.accent)}>
              <Award className="h-5 w-5" /> Certifications & Approvals
            </h2>
            <div className="flex flex-wrap gap-3">
              {certifications.map((cert) => (
                <div key={cert.id} className={cn('px-3 py-2 rounded-lg', styles.sectionBg)}>
                  <span className="font-medium">{cert.name}</span>
                  {cert.issuingAuthority && (
                    <span className="text-xs text-muted-foreground block">{cert.issuingAuthority}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* HSE */}
        {isVisible('hse_quality') && (hseQuality.hsePolicy || hseQuality.qualityPolicy) && (
          <section className={cn('p-4 rounded-lg', styles.sectionBg)}>
            <h2 className={cn('text-lg font-bold mb-3 flex items-center gap-2', styles.accent)}>
              <ShieldCheck className="h-5 w-5" /> HSE & Quality
            </h2>
            {hseQuality.hsePolicy && (
              <div className="mb-2">
                <h4 className="font-medium text-sm">HSE Policy</h4>
                <p className="text-sm">{hseQuality.hsePolicy}</p>
              </div>
            )}
            {hseQuality.qualityPolicy && (
              <div>
                <h4 className="font-medium text-sm">Quality Policy</h4>
                <p className="text-sm">{hseQuality.qualityPolicy}</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
