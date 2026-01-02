import { Controller, Get, Query, Post, UploadedFile, UploadedFiles, UseInterceptors , BadRequestException, ConsoleLogger,Body } from '@nestjs/common';
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

@Controller('file')
export class FileController {

    constructor(private readonly FileService: FileService) {}

    @Post('upload')
    @ApiOperation({ summary: 'Upload file' })
    @ApiResponse({ status: 200, description: 'File uploaded' })

        @UseInterceptors(
          FileInterceptor('file', {
            storage: multerDiskStorage,
            fileFilter: multerFileFilter,
            limits: {
              fileSize: 10 * 1024 * 1024, // 10 MB
            },
          }),
        )

        uploadFile(
            @UploadedFile() file: Express.Multer.File,
            @Body() params: UploadFileDto,
            @User() user: JwtPayload,            
          ) {
          const id =params.id;
          const id_component =params.id_component;
          const id_pers = user.id_pers;
          console.log(params);
          if (!file) {
            throw new BadRequestException('Файл не загружен');
          }
          /*return {
              originalName: file.originalname,
              filename: file.filename,
              path: file.path,
              size: file.size,
          };*/
          console.log(id);
          console.log(id_component);
          console.log(file.path);
          
          // Меню іконка
          if (id_component==0)
            return this.FileService.setMenuIcon(id, file.path, id_pers);

          // Титульне фото
            if (id_component==2)
            return this.FileService.setPhotoPage(id, file.path, id_pers);
              
          // Фото відеогалереї
          if (id_component==8)
            return this.FileService.setPhotoCollection(id, file.path, id_pers);
          
          if (id_component==10)
                return this.FileService.setPhotoPage(id, file.path, id_pers);

          if (id_component==11)
            return this.FileService.setPhotoPage(id, file.path, id_pers);
            
        }
        
    @Post('uploads')
    @ApiOperation({ summary: 'Upload files' })
    @ApiResponse({ status: 200, description: 'Files uploaded' })
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
    ) {
      if (!files || files.length === 0) {
        throw new BadRequestException('Файлы не загружены');
      }

      const { id, id_component } = params;

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
