import multer from "multer";

const storage = multer.memoryStorage();
const uploader = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024, // 1MB limit
  },
});

export default uploader;
