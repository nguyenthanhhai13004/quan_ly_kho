import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
import { ALLOWED_EXCEL_TYPES, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../cores/constants/multer.constant";
import { ROOT_UPLOADS } from "../cores/constants/app.constant";



function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_FILE_TYPES.includes(ext)) {
    return cb(new Error("Chỉ chấp nhận file ảnh hoặc PDF!"));
  }

  cb(null, true);
}

function excelFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXCEL_TYPES.includes(ext)) {
    return cb(new Error("Chỉ chấp nhận file Excel (.xls, .xlsx)!"));
  }

  cb(null, true);
}

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export const uploadExcelMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: excelFilter,
});


export const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, `./${ROOT_UPLOADS}`);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
