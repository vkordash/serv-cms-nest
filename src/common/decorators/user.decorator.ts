import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../auth/types/jwt-payload.type';

export const User = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user) return null;

    // Позволяет @User('id_org')
    return data ? user[data] : user;
  },
);

/*

Можна получать

@User() user
@User('id_org') idOrg

*/