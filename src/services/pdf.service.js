import PDFDocument from "pdfkit";

import templates from "../templates/index.js";

export const generateResumePDF=(resume,res)=>{

const doc=new PDFDocument({

margin:40,

size:"A4"

});

res.setHeader(

"Content-Type",

"application/pdf"

);

doc.pipe(res);

const template=

templates[resume.template] ||

templates.modern;

template(doc,resume);

doc.end();

}