import { Controller, Get, Query, Req, Post, UploadedFile, UploadedFiles, UseInterceptors , BadRequestException, ConsoleLogger,Body } from '@nestjs/common';
//import { Injectable } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';

//import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from'./dto/UploadFileDto';
import { multerDiskStorage } from 'src/common/multer/multer.storage';
import { multerFileFilter, multerFileFilterEditor } from 'src/common/multer/multer.filter';
import { FileService } from './file.service';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { ImageService } from 'src/services/image.service';
import { use } from 'passport';

@Controller('file')
export class FileController {

//    constructor(private readonly FileService: FileService) {}
    constructor(private readonly FileService: FileService, private readonly imageService: ImageService) {}

    @Post('upload')
    @ApiOperation({ summary: 'Upload file' })
    @ApiResponse({ status: 200, description: 'File uploaded' })
    @UseGuards(JwtAuthGuard)
        @UseInterceptors(
          FileInterceptor('file', {
            storage: multerDiskStorage,
            fileFilter: multerFileFilter,
            limits: {
              fileSize: 10 * 1024 * 1024, // 10 MB
            },
          }),
        )

        async uploadFile(
            @UploadedFile() file: Express.Multer.File,
            @Body() params: UploadFileDto,
            @Req() req: Request,
            @User() user: JwtPayload,            
          ) {
          const id =params.id;
          const id_component =params.id_component;
          const id_pers = user.id_pers;
          const id_org = user.id_org;
          const db = user.db;
          

          if (!file) {
            throw new BadRequestException('Файл не загружен');
          }
          
          
          
          const images = await this.imageService.generateImages(file);
          console.log(images);
          
          file.path = file.path.replace('var/www/uploads', 'web_docs');

          /*const normalize = (p: string) =>
          p.replace('/var/www/uploads', 'web_docs');

          return {
            original: normalize(images.large),
            medium: normalize(images.medium),
            thumb: normalize(images.thumb),
          };*/


          // Меню іконка
          if (id_component==0)
            return this.FileService.setMenuIcon(id, file.path, id_pers, db);

          // Титульне фото
            if (id_component==2)
            return this.FileService.setPhotoPage(id, file.path, id_pers,db);
              
          // Фото відеогалереї
          if (id_component==8)
            return this.FileService.setPhotoCollection(id, file.path, id_pers, id_org, db);

          // Фото галерея
          if (id_component==9)
            return this.FileService.uploadPhoto(id, file.path, id_pers, id_org,db);
          
          if (id_component==10)
                return this.FileService.setPhotoPage(id, file.path, id_pers,db);

          if (id_component==11)
            return this.FileService.setPhotoPage(id, file.path, id_pers,db);
            
        }
        
    @Post('uploads')
    @ApiOperation({ summary: 'Upload files' })
    @ApiResponse({ status: 200, description: 'Files uploaded' })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
      FilesInterceptor('files', 10, {
        storage: multerDiskStorage,
        fileFilter: multerFileFilter,
        limits: {
          fileSize: 10 * 1024 * 1024, // 10 MB
        },
      }),
    )
    async uploadFiles(
      @UploadedFiles() files: Express.Multer.File[],
      @Body() params: UploadFileDto,
      @Req() req: Request,
      @User() user: JwtPayload, 
    ) {
      if (!files || files.length === 0) {
        throw new BadRequestException('Файлы не загружены');
      }

      const { id, id_component } = params;
      const id_pers = user.id_pers;
      const db = user.db;
      console.log(files);
      return files;
      /*return {
              originalName: file.originalname,
              filename: file.filename,
              path: file.path,
              size: file.size,
      };*/
      //return this.FileService.setMenuIcon(id, file.path);
    }

  
}
