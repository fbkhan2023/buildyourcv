import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useResume } from '@/contexts/ResumeContext';
import { FileText, FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ExportButtons = () => {
  const { resumeData } = useResume();
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);

  const exportToPdf = async () => {
    setIsExportingPdf(true);
    try {
      const element = document.getElementById('resume-preview');
      if (!element) {
        throw new Error('Resume preview not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: -window.scrollY,
        windowHeight: element.scrollHeight,
        height: element.scrollHeight,
        width: element.scrollWidth,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'letter',
        hotfixes: ['px_scaling'],
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 0;

      while (heightLeft > 0) {
        if (pageNumber > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight;
        pageNumber++;
      }

      pdf.save(`${resumeData.personalInfo.fullName || 'resume'}.pdf`);
      toast.success('Resume exported as PDF!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const formatFullDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const exportToWord = async () => {
    setIsExportingWord(true);
    try {
      const { personalInfo, education, experience, skills, languages, certifications, summary } = resumeData;

      const children: Paragraph[] = [];

      // Header - Name
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: personalInfo.fullName || 'Your Name',
              bold: true,
              size: 48,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        })
      );

      // Desired Job
      if (personalInfo.desiredJob) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: personalInfo.desiredJob,
                size: 28,
                color: '666666',
              }),
            ],
            alignment: AlignmentType.CENTER,
          })
        );
      }

      // Contact Info
      const contactParts: string[] = [];
      if (personalInfo.email) contactParts.push(personalInfo.email);
      if (personalInfo.phone) contactParts.push(personalInfo.phone);
      if (personalInfo.location) contactParts.push(personalInfo.location);
      
      if (contactParts.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: contactParts.join(' | '),
                size: 22,
                color: '666666',
              }),
            ],
            alignment: AlignmentType.CENTER,
          })
        );
      }

      // Date of Birth & Nationality
      const personalDetails: string[] = [];
      if (personalInfo.dateOfBirth) personalDetails.push(`DOB: ${formatFullDate(personalInfo.dateOfBirth)}`);
      if (personalInfo.nationality) personalDetails.push(`Nationality: ${personalInfo.nationality}`);
      
      if (personalDetails.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: personalDetails.join(' | '),
                size: 20,
                color: '666666',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        );
      } else {
        children.push(new Paragraph({ text: '', spacing: { after: 400 } }));
      }

      // Summary
      if (summary) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL SUMMARY',
                bold: true,
                size: 26,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );
        children.push(
          new Paragraph({
            children: [new TextRun({ text: summary, size: 22 })],
            spacing: { after: 400 },
          })
        );
      }

      // Experience
      if (experience.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'EXPERIENCE',
                bold: true,
                size: 26,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );

        experience.forEach((exp) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: exp.position, bold: true, size: 24 }),
                new TextRun({ text: ` at ${exp.company}`, size: 24 }),
              ],
            })
          );
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}${exp.location ? ` | ${exp.location}` : ''}`,
                  size: 20,
                  color: '666666',
                }),
              ],
              spacing: { after: 100 },
            })
          );
          if (exp.description) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: exp.description, size: 22 })],
                spacing: { after: 100 },
              })
            );
          }
          exp.achievements.forEach((achievement) => {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: `• ${achievement}`, size: 22 })],
                indent: { left: 360 },
              })
            );
          });
          children.push(new Paragraph({ text: '', spacing: { after: 200 } }));
        });
      }

      // Education
      if (education.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'EDUCATION',
                bold: true,
                size: 26,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );

        education.forEach((edu) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: edu.institution, bold: true, size: 24 }),
              ],
            })
          );
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`,
                  size: 22,
                }),
              ],
            })
          );
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.startDate} - ${edu.endDate}`,
                  size: 20,
                  color: '666666',
                }),
              ],
              spacing: { after: 200 },
            })
          );
        });
      }

      // Skills
      if (skills.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'SKILLS',
                bold: true,
                size: 26,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );

        // Group skills by category
        const groupedSkills = skills.reduce((acc, skill) => {
          const category = skill.category || 'General';
          if (!acc[category]) acc[category] = [];
          acc[category].push(skill.name);
          return acc;
        }, {} as Record<string, string[]>);

        Object.entries(groupedSkills).forEach(([category, skillNames]) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${category}: `, bold: true, size: 22 }),
                new TextRun({ text: skillNames.join(', '), size: 22 }),
              ],
            })
          );
        });
      }

      // Languages
      if (languages.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'LANGUAGES',
                bold: true,
                size: 26,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );

        const proficiencyLabels: Record<string, string> = {
          basic: 'Basic',
          conversational: 'Conversational',
          professional: 'Professional',
          fluent: 'Fluent',
          native: 'Native',
        };

        languages.forEach((lang) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${lang.name}: `, bold: true, size: 22 }),
                new TextRun({ text: proficiencyLabels[lang.proficiency] || lang.proficiency, size: 22 }),
              ],
            })
          );
        });
      }

      // Certifications
      if (certifications.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'CERTIFICATIONS',
                bold: true,
                size: 26,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );

        certifications.forEach((cert) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: cert.name, bold: true, size: 22 }),
              ],
            })
          );
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${cert.issuer}${cert.issueDate ? ` • ${cert.issueDate}` : ''}${cert.credentialId ? ` • ID: ${cert.credentialId}` : ''}`, size: 20, color: '666666' }),
              ],
              spacing: { after: 100 },
            })
          );
        });
      }

      // Personal Documents
      if (personalInfo.passportNumber || personalInfo.idNumber || personalInfo.hasDrivingLicense) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'PERSONAL DOCUMENTS',
                bold: true,
                size: 26,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );

        if (personalInfo.passportNumber) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Passport: ', bold: true, size: 22 }),
                new TextRun({ text: `${personalInfo.passportNumber}${personalInfo.passportExpiry ? ` (Expires: ${formatFullDate(personalInfo.passportExpiry)})` : ''}`, size: 22 }),
              ],
            })
          );
        }

        if (personalInfo.idNumber) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'ID Card: ', bold: true, size: 22 }),
                new TextRun({ text: `${personalInfo.idNumber}${personalInfo.idExpiry ? ` (Expires: ${formatFullDate(personalInfo.idExpiry)})` : ''}`, size: 22 }),
              ],
            })
          );
        }

        if (personalInfo.hasDrivingLicense) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Driving License: ', bold: true, size: 22 }),
                new TextRun({ text: `Yes${personalInfo.drivingLicenseCountry ? ` (${personalInfo.drivingLicenseCountry})` : ''}`, size: 22 }),
              ],
            })
          );
        }
      }

      // Additional Notes
      if (personalInfo.comment) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'ADDITIONAL NOTES',
                bold: true,
                size: 26,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );
        children.push(
          new Paragraph({
            children: [new TextRun({ text: personalInfo.comment, size: 22 })],
          })
        );
      }

      const doc = new Document({
        sections: [{ children }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${personalInfo.fullName || 'resume'}.docx`);
      toast.success('Resume exported as Word document!');
    } catch (error) {
      console.error('Word export error:', error);
      toast.error('Failed to export Word document');
    } finally {
      setIsExportingWord(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={exportToPdf}
        disabled={isExportingPdf}
        variant="outline"
        className="gap-2"
      >
        {isExportingPdf ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        Export PDF
      </Button>
      <Button
        onClick={exportToWord}
        disabled={isExportingWord}
        variant="outline"
        className="gap-2"
      >
        {isExportingWord ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
        Export Word
      </Button>
    </div>
  );
};
