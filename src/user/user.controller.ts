import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) {}
    
        @ApiTags('Користувач')
        @ApiOperation({summary: 'Отримати користувача по ідентифікатору'})
        @ApiResponse({status:200, type: [UserDto] })
        @UseGuards(JwtAuthGuard)  
        @Get('')
            async getData(
                @User() user: JwtPayload
            ) {
                const params = {
                    id_pers:user.id_pers,
                    db: user.db
                };
                return this.UserService.getData(params);
            }  
}
