import { diskStorage } from 'multer';
import { extname } from 'path';
import { transliterate, createUploadPath } from '../utils.upload';
import { Request } from 'express';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

export const multerDiskStorage = diskStorage({
  destination: (req: Request & { user?: JwtPayload }, file, cb) => {


    try {
      // 👇 payload из JWT
      //  @User() user: JwtPayload
      const User = req.user || undefined;
      if (!User) {
        return cb(new Error('User not authenticated'), '');
      }
      const uploadPath = createUploadPath(User.id_org);
      cb(null, uploadPath);
    } catch (err) {
      cb(err, '');
    }

    
    
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