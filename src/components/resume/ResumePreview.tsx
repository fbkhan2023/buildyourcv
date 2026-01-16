import { useResume } from '@/contexts/ResumeContext';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, Linkedin, Globe, Cake, Flag, CreditCard, Car } from 'lucide-react';
import { format, parse } from 'date-fns';

export const ResumePreview = () => {
  const { resumeData } = useResume();
  const { personalInfo, education, experience, skills, summary, template } = resumeData;

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
  };

  const styles = templateStyles[template];

  return (
    <div
      id="resume-preview"
      className={cn(
        'w-full max-w-[8.5in] mx-auto shadow-elevated rounded-lg overflow-hidden',
        styles.container
      )}
      style={{ minHeight: '11in', padding: '0 1.5rem' }}
    >
      {/* Header */}
      <div className={cn(styles.header, 'relative')}>
        <div className="flex items-start gap-6">
          {/* Photo */}
          {personalInfo.photo && (
            <div className="flex-shrink-0">
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName}
                className={cn(
                  'w-24 h-24 rounded-full object-cover border-4',
                  template === 'modern' ? 'border-white/30' : 'border-primary/20'
                )}
              />
            </div>
          )}
          
          <div className="flex-1">
            <h1 className={cn(
              'text-3xl font-display font-bold mb-1',
              template !== 'modern' && 'text-foreground'
            )}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.desiredJob && (
              <p className={cn(
                'text-xl mb-4',
                template === 'modern' ? 'text-white/90' : 'text-muted-foreground'
              )}>
                {personalInfo.desiredJob}
              </p>
            )}
            <div className={cn(
              'flex flex-wrap gap-4 text-sm',
              template === 'modern' ? 'text-white/80' : 'text-muted-foreground'
            )}>
              {personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="h-4 w-4" />
                  {personalInfo.linkedin}
                </span>
              )}
              {personalInfo.website && (
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {personalInfo.website}
                </span>
              )}
              {personalInfo.dateOfBirth && (
                <span className="flex items-center gap-1">
                  <Cake className="h-4 w-4" />
                  DOB: {formatFullDate(personalInfo.dateOfBirth)}
                </span>
              )}
              {personalInfo.nationality && (
                <span className="flex items-center gap-1">
                  <Flag className="h-4 w-4" />
                  {personalInfo.nationality}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-10 py-8 space-y-6">
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
