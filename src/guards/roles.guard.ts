// guards/roles.guard.ts
import { Reflector } from "@nestjs/core";
import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { ROLES_KEY } from "src/decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    return user?.roles?.some(role =>
      requiredRoles.includes(role),
    );
  } 
}
