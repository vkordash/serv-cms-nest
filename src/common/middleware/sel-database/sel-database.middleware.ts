import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class SelDatabaseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
  //  console.log('Request....'+req.headers);
    next();
  }
}
