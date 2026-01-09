import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { SliderService } from './slider.service';
import { SliderDto } from './dto/slider.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('slider')
export class SliderController {
    constructor(private readonly SliderService: SliderService) {}
    
    @ApiTags('Слайдер')
    @ApiOperation({summary: 'Отримати дані слайдера по ідентифікатору пункту меню з limit та offfset'})
    @ApiResponse({status:200, type: [SliderDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('')
        async getData(@Query('id_menu') id_menu: number, @Query('offset') offset: number = 0, @Query('limit') limit: number = 12, @Query('search') search: string =  '') {
             const params = {
                id_menu:id_menu,
                offset:offset,
                limit: limit,
                search: search
            };
            console.log(params);
            return this.SliderService.getData(params);
        }  
    
    @ApiOperation({summary: 'Отримати кількість слайдів по ідентифікатору пункту меню'})
    @ApiResponse({status:200, type: [SliderDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('cnt')
        async getCntData(@Query('id_menu') id_menu: number) {
             const params = {
                id_menu:id_menu               
            };
            console.log(params);
            return this.SliderService.getCnt(params);
        } 
    
    @ApiOperation({summary: 'Отримати кількість слайдів по ідентифікатору пункту меню'})
    @ApiResponse({status:200, type: [SliderDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('add')
        async add(
            @Query('id_menu') id_menu: number,
            @User() user: JwtPayload
        ) {
             const params = {
                id_menu:id_menu,
                id_pers: user.id_pers,
                id_org: user.id_org
            };
            console.log(params);
            return this.SliderService.add(params);
        } 
}
