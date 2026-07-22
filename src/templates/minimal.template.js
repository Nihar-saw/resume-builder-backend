export default function minimal(doc,resume){

doc

.fontSize(24)

.text(resume.personalInfo.fullName);

doc.moveDown();

doc.text(resume.summary);

}