import { Controller, Get } from '@nestjs/common';
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
    async getData() {
            return this.ComponentService.getData();
        }
}

/*

import { Controller, Get, Query, ParseIntPipe, Optional   } from '@nestjs/common';
import { PageService } from './page.service';
import { PageDto} from './dto/page.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('page')
export class PageController {

    constructor(private readonly PageService: PageService) {}

    @ApiTags('Api для роботи з сторінками')

    @ApiOperation({summary: 'Отримати сторінку по id '})
    @ApiResponse({status:200, type: [PageDto] })
    @Get()
        async getData(
            @Query('id', ParseIntPipe) id: number,          // обязательный
            @Query('tp') tp?: string,                       // необязательный
        ) {
            const params = { id, tp };
            return this.PageService.getData(params);
        }
    
    @ApiOperation({summary: 'Отримати кількість сторінок для id_menu та фільтра'})
    @ApiResponse({status:200, type: [PageDto] })
    @Get('cnt')
        async getCnt(
            @Query('id', ParseIntPipe) id: number,
            @Query('search') search?: string, 
        ) {
            const params = { id, search };
            return this.PageService.getCnt(params);
        }
    
    @ApiOperation({summary: 'Отримати список сторінок для id_menu та фільтра'})
    @ApiResponse({status:200, type: [PageDto] })
    @Get('list')
        async getList(
            @Query('id', ParseIntPipe) id: number,          
            @Query('offset', ParseIntPipe) offset: number,          
            @Query('limit', ParseIntPipe) limit: number,          
            @Query('search') search?: string,              
        ) {
            const params = { id, offset, limit, search };
            return this.PageService.getList(params);
        }
    
    @Get('listnew')
        async getPages(
            @Query('id') id: number,
            @Query('limit') limit = 10,
            @Query('offset') offset = 0,
            @Query('search') search?: string,
        ) {
            return this.PageService.getPages({
            id: Number(id),
            limit: Number(limit),
            offset: Number(offset),
            search,
            }); 
        }
}
*/