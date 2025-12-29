import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { ChipsDto } from './dto/chips.dto';
import { ChipsService } from './chips.service';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('chips')
export class ChipsController {

    constructor(private readonly ChipsService: ChipsService) {}
        
    @ApiTags('Таблиця Chips ')
        
    @ApiOperation({summary: 'Отримати список тегів '})
    @ApiResponse({status:200, type: String, isArray: true })
    @UseGuards(JwtAuthGuard)
    @Get('')
        async getPage(@Query('id') id: number, @Query('id_component') id_component: number) {
            const params = {
                id:id,
                id_component:id_component 
            };
            return this.ChipsService.getData(params);
        } 

    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: [ChipsDto] })
    @UseGuards(JwtAuthGuard)
    @Get('add')
        async add(
            @Query('id') id: number, 
            @Query('id_component') id_component: number, 
            @Query('name') name: string,
            @User() user: JwtPayload
        ) {
            const params = {
                id:id,
                id_component:id_component,
                name: name,
                id_pers: user.id_pers 
            };
            return this.ChipsService.add(params);
        } 

    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: [ChipsDto] })
    @UseGuards(JwtAuthGuard)
    @Get('del')
        async del(
            @Query('id') id: number, 
            @Query('id_component') id_component: number, 
            @Query('name') name: string,
            @User() user: JwtPayload
        ) {
            const params = {
                id:id,
                id_component:id_component,
                name: name,
                id_pers: user.id_pers 
            };
            return this.ChipsService.delete(params);
        } 
}
