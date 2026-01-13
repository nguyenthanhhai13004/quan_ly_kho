import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { ROOT_UPLOADS } from "../cores/constants/app.constant";

export function cleanupUpload(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    if (res.statusCode >= 400 && req.file) {
      const filePath = path.join(`./${ROOT_UPLOADS}`, req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("cleanupUpload:", err);
      });
    }
  });
  next();
}
