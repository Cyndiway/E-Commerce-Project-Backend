import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Multer Storage Config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // create uploads folder if not exists
    }
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

// Multer File Filter (images only)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
