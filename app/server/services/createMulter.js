import path from 'path';

import multer, { diskStorage } from 'multer';

export default function (name, fieldname) {
  const upload = multer({
    storage: diskStorage({
      filename(req, file, callback) {
        const ext = path.extname(file.originalname);
        callback(null, `${name}${ext}`);
      },
    }),
    fileFilter(req, file, callback) {
      const mimetypes = ['image/jpeg', 'image/png'];
      callback(null, mimetypes.some(mimetype => mimetype === file.mimetype));
    },
    limits: {
      fileSize: 10485760, // max 10MB
      files: 7,
      fields: 20,
    },
  });
  return upload.single(fieldname);
}
