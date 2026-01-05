import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { PhotoDto } from './dto/photo.dto';
import { PhotoService } from './photo.service';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('photo')
export class PhotoController {

    constructor(private readonly PhotoService: PhotoService) {}
    
    @ApiTags('Таблиця Photos ')
    
    /*@ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PhotoDto] })
    @Get('')
        async getPage(@Query('id') id: number, @Query('typ') typ: number = 0) {
            const params = {
                id:id,
                tp:typ 
            };
            console.log(params);
            return this.PhotoService.getPage(params);
        } */
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PhotoDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('')
        async getListCollection(@Query('search') search: string =  '') {
            const params = {
                search: search
            };
            console.log(params);
            return this.PhotoService.getListCollections(params);
        } 
    
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PhotoDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('list')
        async getListPage(@Query('id_menu') id_menu: number, @Query('offset') offset: number = 0, @Query('limit') limit: number = 12, @Query('search') search: string =  '') {
            const params = {
                id_menu:id_menu,
                offset:offset,
                limit: limit,
                search: search
            };
            console.log(params);
            return this.PhotoService.getList(params);
        } 
    
    
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: Number })
    @UseGuards(JwtAuthGuard)  
    @Get('cnt')
        async getCnt(@Query('id_menu') id_menu: number, @Query('search') search: string =  '') {
            const params = {
                id_menu:id_menu,
                search: search
            };
            console.log(params);
            return this.PhotoService.getCnt(params);
        }  
    
    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: [PhotoDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('upd')
        async update(
            @Query('id') id: number,
            @Query('name') name: string, 
            @Query('val') val: string,
            @User() user: JwtPayload,
        ) {
            const params = {
                id:id,
                name:name,
                val:val,
                id_pers: user.id_pers 
            };
            return this.PhotoService.update(params);
        }

    /*@ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: [PhotoDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('upd')
        async update(
            @Query('id_page') id_page: number,
            @Query('name') name: string, 
            @Query('val') val: string,
            @User() user: JwtPayload,
        ) {
            const params = {
                id_page:id_page,
                name:name,
                val:val,
                id_pers: user.id_pers 
            };
            return this.PhotoService.update(params);
        }*/
    
    
}
