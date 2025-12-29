import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService  } from '@nestjs/config';
import configuration from '../config/configuration';
import { Pool } from 'pg';

@Global() // делает доступным во всем приложении
@Module({
  imports: [    
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],     
    }),
  ],
  providers: [
    {
      provide: 'PG_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        const pool = new Pool({
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.database,
        });
        
        // проверим соединение
        await pool.query('SELECT NOW()');
        return pool;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['PG_CONNECTION'],
})
export class DatabaseModule {}