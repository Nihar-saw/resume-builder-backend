export default function creative(doc,resume){

doc

.rect(0,0,595,80)

.fill("#1e3a8a");

doc

.fillColor("white")

.fontSize(26)

.text(

resume.personalInfo.fullName,

40,

30

);

doc.fillColor("black");

doc.moveDown(3);

doc.text(resume.summary);

}