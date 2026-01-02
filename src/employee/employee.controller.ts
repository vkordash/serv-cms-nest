import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dto/employee.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly EmployeeService: EmployeeService) {}
    
    @ApiTags('Працівник')
    @ApiOperation({summary: 'Отримати працівника по ідентифікатору'})
    @ApiResponse({status:200, type: [EmployeeDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('')
        async getData(@User() user: JwtPayload) {
            const params = {
                id_pers:user.id_pers 
            };
            return this.EmployeeService.getData(params);
        }  
    
    @ApiTags('Доступ для працівника')
    @ApiOperation({summary: 'Отримати працівника по ідентифікатору'})
    @ApiResponse({status:200, type: [EmployeeDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('access')
        async getAccess(@Query('id') id: number) {
            const params = {
                id:id 
            };
            return this.EmployeeService.getAccess(params);
        }
    
    @ApiOperation({summary: 'Отримати сторінку за запитом '})
    @ApiResponse({status:200, type: [EmployeeDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('upd')
        async update(
            @Query('name') name: string, 
            @Query('val') val: string,
            @User() user: JwtPayload
        ) {
            const params = {
                id_pers: user.id_pers,
                name:name,
                val:val                 
            };
            return this.EmployeeService.update(params);
        }
}