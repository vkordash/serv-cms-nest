import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { VideoDto } from './dto/video.dto';
import { VideoService } from './video.service';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('video')
export class VideoController {

    constructor(private readonly VideoService: VideoService) {}
        
    @ApiTags('Таблиця Photos ')

    @ApiOperation({summary: 'Отримати сторінку за запитом '})
        @ApiResponse({status:200, type: [VideoDto] })
        @UseGuards(JwtAuthGuard)  
        @Get('')
            async getListPage(@Query('id_menu') id_menu: number, @Query('offset') offset: number = 0, @Query('limit') limit: number = 12, @Query('search') search: string =  '') {
                const params = {
                    id_menu:id_menu,
                    offset:offset,
                    limit: limit,
                    search: search
                };
                console.log(params);
                return this.VideoService.getList(params);
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
                return this.VideoService.getCnt(params);
            } 
        
        @ApiOperation({summary: 'Добавити запис '})
        @ApiResponse({status:200, type: Number })
        @UseGuards(JwtAuthGuard)  
        @Get('add')
            async add (
                @Query('id_menu') id_menu: number,
                @User() user: JwtPayload
            ) {
                const params = {
                    id_menu:id_menu,
                    id_pers: user.id_pers,
                    id_org: user.id_org
                };
                console.log(params);
                return this.VideoService.add(params);
            } 
        
        @ApiOperation({summary: 'Вилучити запис по id'})
        @ApiResponse({status:200, type: Number })
        @UseGuards(JwtAuthGuard)  
        @Get('del')
            async del(
                @Query('id_menu') id: number,
                @User() user: JwtPayload
            ) {
                const params = {
                    id:id,
                    id_pers: user.id_pers
                };
                console.log(params);
                return this.VideoService.delete(params);
            } 

        @ApiOperation({summary: 'Оновити запис по id  '})
        @ApiResponse({status:200, type: Number })
        @UseGuards(JwtAuthGuard)  
        @Get('upd')
            async update(
                @Query('id') id: number, 
                @Query('name') name: string, 
                @Query('val') val: string,
                @User() user: JwtPayload
            ) {
                const params = {
                    id:id,
                    name: name,
                    val: val,
                    id_pers: user.id_pers
                };
                console.log(params);
                return this.VideoService.update(params);
            } 
}
