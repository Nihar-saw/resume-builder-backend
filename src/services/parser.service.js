import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

export const parsePDF = async (file) => {
    const data = await pdf(file.buffer);
    return data.text;
};

export const extractResumeText = async (file) => {

    if (file.mimetype === "application/pdf") {

        const data = await pdf(file.buffer);

        return data.text;
    }

    if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {

        const data = await mammoth.extractRawText({
            buffer: file.buffer,
        });

        return data.value;
    }

    throw new Error("Unsupported file.");
};