import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter(req, file, cb) {

        const allowed = [
            ".pdf",
            ".docx"
        ];

        const ext = path.extname(file.originalname).toLowerCase();

        if (!allowed.includes(ext)) {
            return cb(new Error("Only PDF and DOCX are allowed."));
        }

        cb(null, true);
    },
});

export default upload;