import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { MenuDto } from './dto/menu.dto';
import { MenuService } from './menu.service';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('menu')
export class MenuController {
    constructor(private readonly MenuService: MenuService) {}

    @ApiTags('Довідник налаштувань')

    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: [MenuDto] })
    @UseGuards(JwtAuthGuard)    
    @Get('')
        async getData(
            @Query('id') id: number,
            @User() user: JwtPayload,
        ){
            const params = {
                id:id,
                id_pers: user.id_pers,
                db: user.db               
            };
            return this.MenuService.getMenuById(params);
        }  
    
    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: [MenuDto] })
    @UseGuards(JwtAuthGuard)    
    @Get('update')
        async update(
            @Query('id') id: number,
            @Query('name') name: string, 
            @Query('val') val: string,
            @User() user: JwtPayload
        ){

            const params = {
                id:id,
                name:name,
                val:val,
                id_pers:user.id_pers,
                db: user.db                
            };
            return this.MenuService.update(params);
        }

    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: [MenuDto] })
    @UseGuards(JwtAuthGuard)
    @Get('getMenu')
        async getMenu(
            @Query('id') id: number,
            @User() user: JwtPayload,
        ) {
        const params = {
            id:id,
            db: user.db     
        };
        return this.MenuService.getMenu(params);
        }  
    
    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: [MenuDto] })
    @UseGuards(JwtAuthGuard)
    @Get('getMenuItem')
        async getMenuItem(
            @Query('id') id: number,
            @User() user: JwtPayload
        ) {
        const params = {
            id:id,
            db: user.db     
        };
        return this.MenuService.getMenuItem(params);
        }  
    
    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: [MenuDto] })
    @UseGuards(JwtAuthGuard)
    @Get('getSubMenu')
        async getSubMenu(
            @Query('id') id: number,
            @User() user: JwtPayload
        ) {
        const params = {
            id:id,
            db: user.db     
        };
        return this.MenuService.getSubMenu(params);
        } 
    
    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: [MenuDto] })
    @UseGuards(JwtAuthGuard)
    @Get('getTreeItem')
        async getTreeItem(
            @Query('id') id: number,
            @User() user: JwtPayload
        ) {
        const params = {
            id:id,
            db: user.db     
        };
        return this.MenuService.getTreeItem(params);
        }  
    
    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: [MenuDto] })
    @UseGuards(JwtAuthGuard)
    @Get('del')
        async del(
            @Query('id') id: number,
            @User() user: JwtPayload
        ) {
            const params = {
                id:id,
                id_pers: user.id_pers,
                db: user.db    
            };
            return this.MenuService.del(params);
        } 

    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: [MenuDto] })
    @UseGuards(JwtAuthGuard)
    @Get('add')
        async add(
            @Query('id') id: number, 
            @User() user: JwtPayload) {
                const params = {
                    id:id,
                    id_pers: user.id_pers,
                    id_org: user.id_org,
                    db: user.db     
                };
            return this.MenuService.add(params);
        }  
    
    @ApiOperation({summary: 'Отримати налаштування '})
    @ApiResponse({status:200, type: [MenuDto] })
    @UseGuards(JwtAuthGuard)
    @Get('drop')
        async drop(
            @Query('id') id: number,
            @Query('parent') parent: number, 
            @User() user: JwtPayload
        ) {
            const params = {
                id:id,
                parent:parent,
                id_pers: user.id_pers,
                db: user.db 
            };
            return this.MenuService.drop(params);
        }  
    
}