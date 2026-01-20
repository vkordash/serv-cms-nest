// image.service.ts
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { IMAGE_SIZES } from '../config/image-sizes.config';

export class ImageService {

  async generateImages(file: Express.Multer.File) {
    const dir = path.dirname(file.path);
    const ext = path.extname(file.path);
    const filename = path.basename(file.path, ext);

    const output: Record<string, string> = {};

    for (const size of IMAGE_SIZES) {
      const target = path.join(
        dir,
        `${size.prefix}-${filename}.jpg`,
      );

      /*await sharp(file.path)
        .resize({
          width: size.width,
          withoutEnlargement: true,
        })
        .jpeg({
          quality: size.quality,
          mozjpeg: true,
        })
        .toFile(target);*/

      output[size.prefix] = target;
    }

    // удаляем исходный «сырой» файл
    //fs.unlinkSync(file.path);

    return output;
  }
}