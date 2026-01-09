
import { Controller, Get, Query, Post, ConsoleLogger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { TitulPhotoDto } from './dto/titul-photo.dto';
import { TitulPhotoService } from './titul-photo.service';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('titul-photo')
export class TitulPhotoController {
    constructor(private readonly TitulPhotoService: TitulPhotoService) {}

    @ApiTags('Титульне фото')

    @ApiOperation({summary: 'Отримати титульне фото'})
    @ApiResponse({status:200, type: [TitulPhotoDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('')
        async getTitPhoto(
            @Query('id') id: number,
            @User() user: JwtPayload
        ) {
            const params = {
                id:id,
                db: user.db 
            };
            return this.TitulPhotoService.getTitPhoto(params);
        }  
    
    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: Boolean })
    @UseGuards(JwtAuthGuard)  
    @Get('del')
        async del(
            @Query('id') id: number,
            @User() user: JwtPayload
        ) {
            const params = {
                id:id,
                id_pers: user.id_pers,
                db:user.db 
            };
            return this.TitulPhotoService.delete(params);
        } 
    
    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: Boolean })
    @UseGuards(JwtAuthGuard)  
    @Get('upd')
        async upd(
                @Query('id') id: number,
                @Query('title') title: string,
                @Query('alt') alt: string,
                @Query('height') height: number,
                @Query('width') width: number,
                @User() user: JwtPayload
            ) {
            const params = {
                id:id,
                title: title, 
                alt: alt, 
                height:height, 
                width:width,
                id_pers: user.id_pers,
                db:user.db
            };
            return this.TitulPhotoService.update(params);
        }   
}
