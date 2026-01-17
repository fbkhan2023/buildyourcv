import { useResume } from '@/contexts/ResumeContext';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, Linkedin, Globe, Cake, Flag, CreditCard, Car } from 'lucide-react';
import { format, parse } from 'date-fns';

const skillLevelToPercent = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};

const proficiencyLabels = {
  basic: 'Basic',
  conversational: 'Conversational',
  professional: 'Professional',
  fluent: 'Fluent',
  native: 'Native',
};

export const ResumePreview = () => {
  const { resumeData } = useResume();
  const { personalInfo, education, experience, skills, languages, certifications, summary, template } = resumeData;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr === 'Present') return 'Present';
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatFullDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = parse(dateStr, 'yyyy-MM-dd', new Date());
      return format(date, 'dd MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const templateStyles = {
    modern: {
      container: 'bg-white',
      header: 'gradient-primary text-white p-8',
      section: 'border-l-4 border-primary pl-4',
      sectionTitle: 'text-primary font-bold text-lg mb-3',
    },
    classic: {
      container: 'bg-white',
      header: 'border-b-2 border-foreground p-8',
      section: 'border-b border-border pb-4',
      sectionTitle: 'text-foreground font-bold text-lg mb-3 uppercase tracking-wide',
    },
    minimal: {
      container: 'bg-white',
      header: 'p-8',
      section: '',
      sectionTitle: 'text-foreground font-medium text-lg mb-3',
    },
    executive: {
      container: 'bg-white',
      header: 'p-0',
      section: 'border-b border-sky-200 pb-4',
      sectionTitle: 'text-sky-700 font-bold text-base mb-2 uppercase tracking-wide',
    },
  };

  const styles = templateStyles[template];

  // Executive template - two-column layout matching the sample
  if (template === 'executive') {
    return (
      <div
        id="resume-preview"
        className={cn(
          'w-full max-w-[8.5in] mx-auto shadow-elevated rounded-lg overflow-hidden bg-white',
        )}
        style={{ minHeight: '11in' }}
      >
        {/* Top accent bar */}
        <div className="h-3 bg-sky-200" />
        
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-[35%] bg-gray-50 p-6 space-y-6">
            {/* Photo */}
            {personalInfo.photo && (
              <div className="flex justify-center mb-4">
                <img
                  src={personalInfo.photo}
                  alt={personalInfo.fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-sky-200"
                />
              </div>
            )}

            {/* Profile/Summary */}
            {summary && (
              <div>
                <h2 className={styles.sectionTitle}>PROFILE</h2>
                <p className="text-xs text-gray-600 leading-relaxed">{summary}</p>
              </div>
            )}

            {/* Contact */}
            <div>
              <h2 className={styles.sectionTitle}>CONTACT</h2>
              <div className="space-y-2 text-xs text-gray-600">
                {personalInfo.phone && (
                  <div>
                    <span className="font-semibold text-gray-700">PHONE NUMBER:</span>
                    <br />{personalInfo.phone}
                  </div>
                )}
                {personalInfo.website && (
                  <div>
                    <span className="font-semibold text-gray-700">WEBSITE:</span>
                    <br />{personalInfo.website}
                  </div>
                )}
                {personalInfo.email && (
                  <div>
                    <span className="font-semibold text-gray-700">EMAIL ADDRESS:</span>
                    <br />{personalInfo.email}
                  </div>
                )}
                {personalInfo.passportNumber && (
                  <div>
                    <span className="font-semibold text-gray-700">Passport no.</span> {personalInfo.passportNumber}
                    {personalInfo.passportExpiry && (
                      <><br />Expiry Date: {formatFullDate(personalInfo.passportExpiry)}</>
                    )}
                  </div>
                )}
                {personalInfo.idNumber && (
                  <div>
                    <span className="font-semibold text-gray-700">ID#</span> {personalInfo.idNumber}
                    {personalInfo.idExpiry && (
                      <><br />Expiry Date: {formatFullDate(personalInfo.idExpiry)}</>
                    )}
                  </div>
                )}
                {personalInfo.hasDrivingLicense && (
                  <div>
                    <span className="font-semibold text-gray-700">Driving License:</span> Yes
                    {personalInfo.drivingLicenseCountry && (
                      <><br />Issued by: {personalInfo.drivingLicenseCountry}</>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Skills with progress bars */}
            {skills.length > 0 && (
              <div>
                <h2 className={styles.sectionTitle}>SKILLS</h2>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700">{skill.name}</span>
                        <span className="text-gray-500">{skillLevelToPercent[skill.level]}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-sky-400 rounded-full transition-all"
                          style={{ width: `${skillLevelToPercent[skill.level]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h2 className={styles.sectionTitle}>LANGUAGES</h2>
                <div className="space-y-1 text-xs text-gray-600">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between">
                      <span>{lang.name}</span>
                      <span className="text-gray-500">{proficiencyLabels[lang.proficiency]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Main Content */}
          <div className="w-[65%] p-6 space-y-6">
            {/* Name and Title Header */}
            <div className="border-b-2 border-sky-200 pb-4">
              <h1 className="text-4xl font-display font-bold text-gray-800 tracking-wide">
                {personalInfo.fullName?.split(' ').map((name, i) => (
                  <span key={i} className="block">{name.toUpperCase()}</span>
                )) || 'NAME HERE'}
              </h1>
              {personalInfo.desiredJob && (
                <p className="text-sm text-gray-500 mt-2 tracking-widest uppercase">
                  {personalInfo.desiredJob}
                </p>
              )}
            </div>

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className={styles.sectionTitle}>EDUCATION</h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-sm">
                      <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(edu.startDate)}-{formatDate(edu.endDate)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                      {edu.description && (
                        <p className="text-xs text-gray-500 mt-1">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className={styles.sectionTitle}>WORK EXPERIENCE</h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="text-sm">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-800">
                          {exp.company} <span className="font-normal text-gray-600">{exp.position}</span>
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(exp.startDate)}-{exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                      {exp.description && (
                        <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h2 className={styles.sectionTitle}>CERTIFICATIONS</h2>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="text-sm">
                      <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                      <p className="text-xs text-gray-500">{cert.issuer}</p>
                      {cert.issueDate && (
                        <p className="text-xs text-gray-400">
                          Issued: {formatDate(cert.issueDate)}
                          {cert.expiryDate && ` • Expires: ${formatDate(cert.expiryDate)}`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {personalInfo.comment && (
              <div>
                <h2 className={styles.sectionTitle}>ADDITIONAL NOTES</h2>
                <p className="text-xs text-gray-600">{personalInfo.comment}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Other templates (modern, classic, minimal)
  return (
    <div
      id="resume-preview"
      className={cn(
        'w-full max-w-[8.5in] mx-auto shadow-elevated rounded-lg overflow-hidden',
        styles.container
      )}
      style={{ minHeight: '11in', padding: '0 1.5rem' }}
    >
      {/* Header - Compact */}
      <div className={cn(styles.header, 'relative py-4 px-6')}>
        <div className="flex items-center gap-4">
          {/* Photo */}
          {personalInfo.photo && (
            <div className="flex-shrink-0">
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName}
                className={cn(
                  'w-20 h-20 rounded-full object-cover border-3',
                  template === 'modern' ? 'border-white/30' : 'border-primary/20'
                )}
              />
            </div>
          )}
          
          <div className="flex-1 space-y-1">
            <h1 className={cn(
              'text-2xl font-display font-bold leading-tight',
              template !== 'modern' && 'text-foreground'
            )}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.desiredJob && (
              <p className={cn(
                'text-lg leading-tight',
                template === 'modern' ? 'text-white/90' : 'text-muted-foreground'
              )}>
                {personalInfo.desiredJob}
              </p>
            )}
            <div className={cn(
              'flex flex-wrap gap-x-3 gap-y-0.5 text-xs leading-tight',
              template === 'modern' ? 'text-white/80' : 'text-muted-foreground'
            )}>
              {personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="h-3 w-3" />
                  {personalInfo.linkedin}
                </span>
              )}
              {personalInfo.website && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {personalInfo.website}
                </span>
              )}
              {personalInfo.dateOfBirth && (
                <span className="flex items-center gap-1">
                  <Cake className="h-3 w-3" />
                  DOB: {formatFullDate(personalInfo.dateOfBirth)}
                </span>
              )}
              {personalInfo.nationality && (
                <span className="flex items-center gap-1">
                  <Flag className="h-3 w-3" />
                  {personalInfo.nationality}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-12 py-6 space-y-5">
        {/* Summary */}
        {summary && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Professional Summary</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground">{exp.position}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                  )}
                  {exp.achievements.length > 0 && (
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>• {achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground">{edu.institution}</h3>
                      <p className="text-sm text-muted-foreground">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-sm text-muted-foreground mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className="space-y-2">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category}>
                  <span className="text-sm font-medium text-foreground">{category}: </span>
                  <span className="text-sm text-muted-foreground">
                    {categorySkills.map(s => s.name).join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Languages</h2>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <span key={lang.id} className="text-sm text-muted-foreground">
                  {lang.name} ({proficiencyLabels[lang.proficiency]})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Certifications</h2>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <h3 className="font-semibold text-foreground text-sm">{cert.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {cert.issuer}
                    {cert.issueDate && ` • ${formatDate(cert.issueDate)}`}
                    {cert.credentialId && ` • ID: ${cert.credentialId}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document Details */}
        {(personalInfo.passportNumber || personalInfo.idNumber || personalInfo.hasDrivingLicense) && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {personalInfo.passportNumber && (
                <div className="flex items-start gap-2">
                  <CreditCard className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">Passport: </span>
                    <span className="text-muted-foreground">
                      {personalInfo.passportNumber}
                      {personalInfo.passportExpiry && ` (Expires: ${formatFullDate(personalInfo.passportExpiry)})`}
                    </span>
                  </div>
                </div>
              )}
              {personalInfo.idNumber && (
                <div className="flex items-start gap-2">
                  <CreditCard className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">ID Card: </span>
                    <span className="text-muted-foreground">
                      {personalInfo.idNumber}
                      {personalInfo.idExpiry && ` (Expires: ${formatFullDate(personalInfo.idExpiry)})`}
                    </span>
                  </div>
                </div>
              )}
              {personalInfo.hasDrivingLicense && (
                <div className="flex items-start gap-2">
                  <Car className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">Driving License: </span>
                    <span className="text-muted-foreground">
                      Yes{personalInfo.drivingLicenseCountry && ` (${personalInfo.drivingLicenseCountry})`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Comment Section */}
        {personalInfo.comment && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Additional Notes</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{personalInfo.comment}</p>
          </div>
        )}
      </div>
    </div>
  );
};
