export default function modern(doc,resume){

doc

.fontSize(26)

.text(resume.personalInfo.fullName,{
align:"center"
});

doc

.fontSize(12)

.text(resume.personalInfo.email,{
align:"center"
});

doc.moveDown();

doc

.fontSize(18)

.text("Professional Summary");

doc

.fontSize(11)

.text(resume.summary);

doc.moveDown();

doc

.fontSize(18)

.text("Skills");

doc.text(resume.skills.join(", "));

}