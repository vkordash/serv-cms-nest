import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { AccessService } from './access.service';
import { AccessDto } from './dto/access.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('access')
export class AccessController {
    constructor(private readonly AccessService: AccessService) {}
    
        @ApiTags('Користувач')
        @ApiOperation({summary: 'Отримати користувача по ідентифікатору'})
        @ApiResponse({status:200, type: [AccessDto] })
        @UseGuards(JwtAuthGuard)  
        @Get('')
            async getData(
                    @Query('id_menu') id_menu: number,
                    @User() user: JwtPayload
                ) {
                const params = {
                    id_menu:id_menu,
                    db: user.db 
                };
                return this.AccessService.getData(params);
            }  

    @ApiTags('Користувач')
    @ApiOperation({summary: 'Отримати користувача по ідентифікатору'})
    @ApiResponse({status:200, type: [AccessDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('add')
        async add (
            @Query('id_menu') id_menu: number, 
            @Query('id_user') id_user: number,
            @User() user: JwtPayload
        ) {
            const params = {
                id_menu:id_menu,
                id_user:id_user,
                id_pers: user.id_pers,
                db: user.db 
            };
            return this.AccessService.add(params);
        }  
    
    @ApiTags('Користувач')
    @ApiOperation({summary: 'Отримати користувача по ідентифікатору'})
    @ApiResponse({status:200, type: [AccessDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('del')
        async del (
            @Query('id_menu') id_menu: number, 
            @Query('id_user') id_user: number,
            @User() user: JwtPayload
        ) {
            const params = {
                id_menu:id_menu,
                id_user:id_user,
                id_pers: user.id_pers,
                db: user.db 
            };
            return this.AccessService.delete(params);
        }  
}
