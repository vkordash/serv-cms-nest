import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class UserService {

    private readonly logger = new Logger(UserService.name);
    
    constructor(
        @Inject('PG_CONNECTION') private readonly pool: Pool,
        private configService: ConfigService
    ) {}

    async getData(params: { id_pers: number }): Promise<any> {
            const { id_pers } = params;
    
            if (!id_pers || isNaN(Number(id_pers))) {
                throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
            }
            
            try {
                // ✅ Получаем все активные элементы, у которых parent = id
                const query = `
                    SELECT 
                        id, id_pers, id_org, activ, login 
                    FROM users_new 
                    WHERE 
                        id_pers=${id_pers} limit 1`;                
                const { rows } = await this.pool.query(query);
                return  rows[0];                 
            } catch (error) {
                this.logger.error(`❌ Помилка отримання користувача id=${id_pers}  : ${error.message}`, error.stack);
                throw new InternalServerErrorException(`Помилка отримання користувача id:${id_pers} `);
            }
        }
}
