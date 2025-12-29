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
    constructor(private readonly AccessService: EmployeeService) {}
    
    @ApiTags('Працівник')
    @ApiOperation({summary: 'Отримати працівника по ідентифікатору'})
    @ApiResponse({status:200, type: [EmployeeDto] })
    @UseGuards(JwtAuthGuard)  
    @Get('')
        async getData(@Query('id') id: number) {
            const params = {
                id:id 
            };
            return this.AccessService.getData(params);
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
            return this.AccessService.getAccess(params);
        }  
}