import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
    },
    fileFilter: (req, file, cb) => {
        const allowed = /^image\/(jpeg|png|webp|gif)$|^video\/(mp4|webm|quicktime)$/;
        if (allowed.test(file.mimetype)) return cb(null, true);
        cb(new Error("Only image or video files are allowed for evidence."));
    },
});

export default upload;