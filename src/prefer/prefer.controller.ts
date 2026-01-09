import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { PreferDto } from './dto/prefer.dto';
import { PreferService } from './prefer.service';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('prefer')
export class PreferController {

    constructor(private readonly PreferService: PreferService) {}
    
    @ApiTags('Таблиця Pages ')
    
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PreferDto] })
    @UseGuards(JwtAuthGuard)
    @Get('org')
        async getDataOrg(
            @Query('name') name: string,
            @User() user: JwtPayload
        ) {
            const params = {
                name:name,
                db: user.db
            };
            console.log(params);
            return this.PreferService.getDataOrg(params);
        } 
    
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PreferDto] })
    @UseGuards(JwtAuthGuard)
    @Get('user')
        async getUserPref(
            @User() user: JwtPayload, 
            @Query('name') name: string
        ) {
            const params = {
                id_pers: user.id_pers,
                name:name,
                db: user.db                
            };
            console.log(params);
            return this.PreferService.getUserPref(params);
        } 
    
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PreferDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('org_upd')
        async updatePrefOrg(
            @Query('name') name: string, 
            @Query('val') val: string,
            @User() user: JwtPayload
        ) {
            const params = {
                id_pers: user.id_pers,
                db : user.db,
                id_org : user.id_org,
                name:name,
                val:val
            };
            console.log(params);
            return this.PreferService.updatePrefOrg(params);
        } 

    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [PreferDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('user_upd')
        async updatePrefUser(
            @Query('name') name: string, 
            @Query('val') val: string,
            @User() user: JwtPayload
        ) {
            const params = {
                id_pers: user.id_pers,
                db : user.db,
                id_org : user.id_org,
                name:name,
                val:val                
            };
            return this.PreferService.updatePrefUser(params);
        } 
}