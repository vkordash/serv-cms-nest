import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { PageDto } from './dto/page.dto';
import { PageService } from './page.service';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';


@Controller('page')
export class PageController {

    /*@Get()
    @UseGuards(JwtAuthGuard)
    getHello(): string {
        return 'Hello Page!';
    }*/

    constructor(private readonly PageService: PageService) {}
    
    @ApiTags('Таблиця Pages ')
    
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PageDto] })
    @UseGuards(JwtAuthGuard)
    @Get('')
        async getPage(@Query('id') id: number, @Query('typ') typ: number = 0) {
            const params = {
                id:id,
                tp:typ 
            };
            console.log(params);
            return this.PageService.getPage(params);
        } 
    
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PageDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('list')
        async getListPage(@Query('id_menu') id_menu: number, @Query('offset') offset: number = 0, @Query('limit') limit: number = 12, @Query('search') search: string =  '') {
            const params = {
                id_menu:id_menu,
                offset:offset,
                limit: limit,
                search: search
            };
            //console.log(params);
            return this.PageService.getList(params);
        } 
    
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PageDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('cnt')
        async getCnt(@Query('id_menu') id_menu: number, @Query('search') search: string =  '') {
            const params = {
                id_menu:id_menu,
                search: search
            };
            console.log(params);
            return this.PageService.getCnt(params);
        } 
    
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PageDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('pref')
        async getPref(@Query('id') id: number) {
            const params = {
                id:id                
            };
            console.log(params);
            return this.PageService.getPref(params);
        } 
    
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PageDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('update')
        async update(
            @Query('id_page') id_page: number,
            @Query('name') name: string, 
            @Query('val') val: string,
            @User() user: JwtPayload
        ) {
            const params = {
                id_page:id_page,
                name:name,
                val:val,
                id_pers: user.id_pers 
            };
            console.log(params);
            return this.PageService.update(params);
        } 
    
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PageDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('add')
        async add(
            @Query('id_menu') id_menu: number,
            @User() user: JwtPayload
        ) {
            const params = {
                id_menu:id_menu,
                id_pers: user.id_pers 
            };
            console.log(params);
            return this.PageService.add(params);
    } 
    /************************************** ВІДЕО */

    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PageDto] })
    @Get('del-titul-photo')
        async delTitulPhoto(@Query('id') id: number, @User() user: JwtPayload) {
            const params = {
                id:id,
                id_pers: user.id_pers               
            };
            console.log(params);
            return this.PageService.delTitulPhoto(params);
        } 
}

