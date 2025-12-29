import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';


@Injectable()
export class PreferService {

    private readonly logger = new Logger(PreferService.name);
    private Prefer:any = {};

    constructor(
        @Inject('PG_CONNECTION') private readonly pool: Pool,
        private configService: ConfigService
    ) {}

    async getData(params: { name: string }): Promise<any> {

        const { name } = params;

        try {
            const query = `
                SELECT * 
                FROM prefer_new 
                WHERE  id =1 and name='${name}')`;
            const { rows } = await this.pool.query(query);
            return  rows[0]['val'];
        } catch (error) {
            this.logger.error(`❌ Помилка отримання налаштувань : ${name}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання налаштувань : ${name}`);
        }              
    }
}
