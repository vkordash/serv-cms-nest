import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
//import striptags from 'striptags';
import { ConfigService } from '@nestjs/config';
import { ComponentDto } from './dto/component.dto';
import { Pool } from 'pg';
//import { decode } from 'he';

@Injectable()
export class ComponentService {

    private readonly logger = new Logger(ComponentService.name);

    constructor(
        @Inject('PG_CONNECTION') private readonly pool: Pool,
        private configService: ConfigService
    ) {}


    async getData(): Promise<ComponentDto[]> {    
        
        const query = `SELECT id, name FROM public.components where activ=1 ORDER BY id ASC`;

        try {
            const res = await this.pool.query(query);

            if (res.rowCount) {
                return res.rows;            
            } 
            else {
                this.logger.error('❌  Помилка. Відсутні записи !');
                throw new InternalServerErrorException('❌ Помилка. Відсутні записи !');    
            }  
           
        } catch (error) {
            this.logger.error('❌ Ошибка при выполнении запроса к БД:', error.stack);
            throw new InternalServerErrorException('Ошибка при получении данных из базы');
        }
    }

    async getItem(params: { id: number}): Promise<ComponentDto[]> {    
        
        const query = `SELECT * FROM public.components where id=$1 limit 1`;
        
        const { id } = params;

        try {
            const res = await this.pool.query(query,[id]);

            if (res.rowCount==1) {
                return res.rows;            
            } 
            else {
                this.logger.error('❌  Помилка. Відсутні записи !');
                throw new InternalServerErrorException('❌ Помилка. Відсутні записи !');    
            }  
           
        } catch (error) {
            this.logger.error('❌ Ошибка при выполнении запроса к БД:', error.stack);
            throw new InternalServerErrorException('Ошибка при получении данных из базы');
        }
    }
}

