import { Body, Controller, Get, Post, Query, UploadedFile, UploadedFiles, UseInterceptors , BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { EditorDto } from './dto/editor.dto';
import { EditorService } from './editor.service';
import { User } from 'src/common/decorators/user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerDiskStorage } from 'src/common/multer/multer.storage';
import { multerFileFilter, multerFileFilterEditor } from 'src/common/multer/multer.filter';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';


@Controller('editor')
export class EditorController {

    constructor(private readonly EditorService: EditorService) {}
    
    @ApiTags('Таблиця Pages ')
    
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [EditorDto] })
    @UseGuards(JwtAuthGuard)
    @Post('save')
        async save(
            @Body() params: any,
            @User() user: JwtPayload
        ) {
            const data = {
                text: params.text,
                id_page: params.pageId,
                id_pers: user.id_pers,
                id_menu: params.menuId,
                tp_page: params.pageTp
            };
            console.log(data);
            return this.EditorService.save(data);
        } 
    
    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type : String })
    @UseGuards(JwtAuthGuard)
    @Get('submenu')
        async getSubMenu(
            @Query('id_menu') id_menu: number,
            @User() user: JwtPayload
        ) {
            const params = {
                id_menu:id_menu,
                id_pers: user.id_pers 
            };
            return this.EditorService.getSubMenu(params);
        } 
    
    @Post('uploadEditor')
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

        uploadEditor(
            @UploadedFile() file: Express.Multer.File,
            @Body() body: { pageId: string; menuId: string; pageTp: string },
            @User() user: JwtPayload
          ) {
          
          if (!file) {
            throw new BadRequestException('Файл не загружен');
          }
        //  file.path = file.path.replace('/var/www', '');
          const params = {
                id_page:body.pageId,
                id_menu:body.menuId,
                id_component:body.pageTp,
                id_pers: user.id_pers,
                path: file.path,
                srcDir: file.destination 
            };
            
           const res =  this.EditorService.Upload_Files(params);

          return {
            originalName: file.originalname,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype,
            location: `${file.path}`, // URL для редактора
          }            
        }    
    
    @Post('uploadsEditor')
    @ApiOperation({ summary: 'Upload files' })
    @ApiResponse({ status: 200, description: 'Files uploaded' })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
      FilesInterceptor('files', 10, {
        storage: multerDiskStorage,
        fileFilter: multerFileFilterEditor,
        limits: {
          fileSize: 10 * 1024 * 1024, // 10 MB
        },
      }),
    )
    async uploadsEditor(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() body: { pageId: string; menuId: string; pageTp: string },
        @User() user: JwtPayload
    ) {
      if (!files || files.length === 0) {
        throw new BadRequestException('Файлы не загружены');
      }

      const params = {
            id_page:body.pageId,
            id_menu:body.menuId,
            id_component:body.pageTp,
            id_pers: user.id_pers,
            path: '',
            srcDir: ''
        };

        
        files: files.map(file => {
            params.path=file.path;
            //params.path = file.path.replace('/var/www', '');
            params.srcDir=file.destination;
            const lnk = this.EditorService.Upload_Files(params);
            console.log(file);
            console.log(lnk);
        });
        

      return {
        count: files.length,
        files: files.map(file => ({
          originalName: file.originalname,
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype,
          location: `${file.path}`, // URL для редактора
        })),
      };
    }
}