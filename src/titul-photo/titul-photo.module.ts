import { Module } from '@nestjs/common';
import { TitulPhotoService } from './titul-photo.service';

@Module({
  providers: [TitulPhotoService]
})
export class TitulPhotoModule {}
