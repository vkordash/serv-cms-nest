import { Body, Controller, Get, HttpException, Post, Req, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import type { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../common/decorators/user.decorator';
import type { JwtPayload } from './types/jwt-payload.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
 // @UseGuards(LocalGuard)
  login(@Body() authPayload: AuthPayloadDto){
    console.log(authPayload);
    const user =  this.authService.validateUser(authPayload);
    if (!user) throw new HttpException('Invalid',401);
    return user;
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@User() user: JwtPayload) {
   // console.log('Inside AuthController status method');
   // console.log(req.user);
    return user;
  }
}