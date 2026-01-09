import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { ComponentDto } from './dto/component.dto';
import { ComponentService } from './component.service';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('component')
export class ComponentController {

    constructor(private readonly ComponentService: ComponentService) {}

    @ApiTags('Api для роботи з сторінками')

    @ApiOperation({summary: 'Отримати список компонентів '})
    @ApiResponse({status:200, type: [ComponentDto] })
    @UseGuards(JwtAuthGuard)
    @Get()
    async getData( 
            @User() user: JwtPayload
        ) {
            const params = {
                db:user.db                
            };
            return this.ComponentService.getData(params);
        }
    
    @ApiOperation({summary: 'Отримати список компонентів '})
    @ApiResponse({status:200, type: [ComponentDto] })
    @UseGuards(JwtAuthGuard)
    @Get('item')
        async getItem(
            @Query('id') id: number,
            @User() user: JwtPayload
        ) {
            const params = {
                id:id,
                db: user.db                
            };
            return this.ComponentService.getItem(params);
        } 
}
