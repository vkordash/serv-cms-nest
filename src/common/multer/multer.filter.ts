import { diskStorage } from 'multer';

export const multerFileFilter = (req, file, cb) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
    return cb(new Error('Invalid file type'), false);
  }
  cb(null, true);
};

export const multerFileFilterEditor = (req, file, cb) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
    return cb(new Error('Invalid file type'), false);
  }
  cb(null, true);
};