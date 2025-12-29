import { Controller } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller('prefer')
export class PreferController {}
