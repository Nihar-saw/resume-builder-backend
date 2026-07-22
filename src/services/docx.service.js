import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from "docx";

export const generateResumeDocx = async (resume) => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            children: [
              new TextRun({
                text: resume.personalInfo.fullName,
                bold: true,
                size: 34,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun(
                `${resume.personalInfo.email} | ${resume.personalInfo.phone}`
              ),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "Professional Summary",
          }),

          new Paragraph(resume.summary),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "Skills",
          }),

          new Paragraph(resume.skills.join(", ")),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "Experience",
          }),

          ...resume.experience.flatMap((exp) => [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              text: exp.position,
            }),
            new Paragraph(exp.company),
            new Paragraph(
              `${exp.startDate} - ${exp.endDate}`
            ),
            new Paragraph(exp.description),
          ]),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "Education",
          }),

          ...resume.education.flatMap((edu) => [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              text: edu.degree,
            }),
            new Paragraph(edu.institution),
            new Paragraph(edu.year),
          ]),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
};