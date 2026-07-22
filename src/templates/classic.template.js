export default function classic(doc,resume){

doc

.fontSize(22)

.text(resume.personalInfo.fullName);

doc

.fontSize(11)

.text(resume.personalInfo.email);

doc.moveDown();

doc

.fontSize(16)

.text("Summary");

doc.text(resume.summary);

}