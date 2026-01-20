import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class TenantPoolService {
  private pools = new Map<string, Pool>();

  getPool(dbName: string): Pool {
    if (!this.pools.has(dbName)) {
      const pool = new Pool({
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASS,
        database: dbName,
        port: 5432,
        max: 10,
        idleTimeoutMillis: 30000,
      });

      this.pools.set(dbName, pool);
    }

    return this.pools.get(dbName);
  }
}
;