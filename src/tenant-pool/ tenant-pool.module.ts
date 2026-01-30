// tenant-pool.module.ts
import { Module, Global } from '@nestjs/common';
import { TenantPoolService } from './tenant-pool.service';

@Global() // Ключевое слово! Делает сервис видимым для ВСЕХ модулей
@Module({
  providers: [TenantPoolService],
  exports: [TenantPoolService],
})
export class TenantPoolModule {}