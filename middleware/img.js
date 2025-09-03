import multer from "multer";
import path from "path";
import fs from "fs";

const imgMiddleware = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.resolve("uploads");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
    fileFilter: (req, file, cb) => {
      const filetypes = /jpg|jpeg|png|gif/;
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = filetypes.test(file.mimetype);

      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error("Images only!"));
      }
    },
  });

  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || err });
    }
    next();
  });
};

export default upload;
