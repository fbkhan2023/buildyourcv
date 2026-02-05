import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { FileText, FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const CompanyExportButtons = () => {
  const { profileData } = useCompanyProfile();
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);

  const exportToPdf = async () => {
    setIsExportingPdf(true);
    try {
      const element = document.getElementById('company-profile-preview');
      if (!element) {
        throw new Error('Profile preview not found');
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
        format: 'a4',
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

      pdf.save(`${profileData.basicInfo.legalName || 'company-profile'}.pdf`);
      toast.success('Profile exported as PDF!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const exportToWord = async () => {
    setIsExportingWord(true);
    try {
      const { basicInfo, contactInfo, overview, visionMission, services, projects, certifications, management, hseQuality } = profileData;

      const children: Paragraph[] = [];

      // Header
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: basicInfo.legalName || 'Company Profile',
              bold: true,
              size: 48,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        })
      );

      if (basicInfo.slogan) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: basicInfo.slogan,
                italics: true,
                size: 24,
                color: '666666',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        );
      }

      // Contact Info
      const contactParts: string[] = [];
      if (contactInfo.emailGeneral) contactParts.push(contactInfo.emailGeneral);
      if (contactInfo.phoneNumbers[0]) contactParts.push(contactInfo.phoneNumbers[0]);
      if (contactInfo.website) contactParts.push(contactInfo.website);
      
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
            spacing: { after: 400 },
          })
        );
      }

      // Overview
      if (overview) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: 'ABOUT US', bold: true, size: 26 })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );
        children.push(
          new Paragraph({
            children: [new TextRun({ text: overview, size: 22 })],
            spacing: { after: 400 },
          })
        );
      }

      // Vision & Mission
      if (visionMission.vision || visionMission.mission) {
        if (visionMission.vision) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: 'VISION', bold: true, size: 26 })],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            })
          );
          children.push(
            new Paragraph({
              children: [new TextRun({ text: visionMission.vision, size: 22 })],
            })
          );
        }
        if (visionMission.mission) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: 'MISSION', bold: true, size: 26 })],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            })
          );
          children.push(
            new Paragraph({
              children: [new TextRun({ text: visionMission.mission, size: 22 })],
            })
          );
        }
      }

      // Services
      if (services.length > 0) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: 'SERVICES & CAPABILITIES', bold: true, size: 26 })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );
        services.forEach((service) => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: service.title, bold: true, size: 24 })],
            })
          );
          if (service.description) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: service.description, size: 22 })],
                spacing: { after: 200 },
              })
            );
          }
        });
      }

      // Projects
      if (projects.length > 0) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: 'PROJECTS & EXPERIENCE', bold: true, size: 26 })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );
        projects.filter(p => !p.isConfidential).forEach((project) => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: project.name, bold: true, size: 24 })],
            })
          );
          if (project.scopeOfWork) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: project.scopeOfWork, size: 22 })],
                spacing: { after: 200 },
              })
            );
          }
        });
      }

      // Certifications
      if (certifications.length > 0) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: 'CERTIFICATIONS', bold: true, size: 26 })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );
        certifications.forEach((cert) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: cert.name, bold: true, size: 22 }),
                new TextRun({ text: cert.issuingAuthority ? ` - ${cert.issuingAuthority}` : '', size: 22 }),
              ],
            })
          );
        });
      }

      const doc = new Document({
        sections: [{ children }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${basicInfo.legalName || 'company-profile'}.docx`);
      toast.success('Profile exported as Word document!');
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
