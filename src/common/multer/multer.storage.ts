import { diskStorage } from 'multer';
import { extname } from 'path';
import { transliterate, createUploadPath } from '../utils.upload';

export const multerDiskStorage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = createUploadPath();
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    const safeName = transliterate(file.originalname);
    const ext = extname(safeName);
    const baseName = safeName.replace(ext, '');

    const filename = `${baseName}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});