import path from "path";

import multer, { diskStorage } from "multer";

export default function(user) {

  return multer({

    storage: diskStorage({
      filename(req, file, callback) {
        const ext = path.extname(file.originalname);
        const filename =  `${Date.now()}_${user.id}${ext}`;
        callback(null, filename);
      }
    }),

    fileFilter(req, file, callback) {
      const mimetypes =["image/jpeg", "image/png"];
      callback(null, mimetypes.some(mimetype => mimetype === file.mimetype));
    },

    limits: {
      fileSize: 10485760, // max 10MB
      files: 7,
      fields: 20
    }

  });
}
