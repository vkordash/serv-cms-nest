import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  validate(login: string, passwd: string, db:string) {
    //console.log('Inside LocalStrategy');
    const user = this.authService.validateUser({ login, passwd, db });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}