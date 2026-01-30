import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Импортируем
import { Pool } from 'pg';

@Injectable()
export class TenantPoolService {
  private pools = new Map<string, Pool>();

  constructor(private configService: ConfigService) {} // Внедряем

  getPool(dbName: string): Pool {
    if (!this.pools.has(dbName)) {
      const pool = new Pool({
        host: this.configService.get<string>('DB_HOST'),
        user: this.configService.get<string>('DB_USER'),
        password: this.configService.get<string>('DB_PASSWORD'), // Теперь точно строка
        database: dbName,
        port: 5432,
        max: 10,
        idleTimeoutMillis: 30000,
      });

      this.pools.set(dbName, pool);
      console.log(`New pool created for database: ${dbName}`);
    }

    return this.pools.get(dbName);
  }
}