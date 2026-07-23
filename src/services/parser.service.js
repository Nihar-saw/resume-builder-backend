import * as pdf from "pdf-parse";
import mammoth from "mammoth";

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