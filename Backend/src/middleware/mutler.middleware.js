import multer from "multer";

// Use memory storage
const storage = multer.memoryStorage();

const upload = multer({ storage });

// Export the upload instance if needed
export { upload };
