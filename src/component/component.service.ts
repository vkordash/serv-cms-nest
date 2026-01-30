import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
//import striptags from 'striptags';
import { ConfigService } from '@nestjs/config';
import { ComponentDto } from './dto/component.dto';
import { TenantPoolService } from 'src/tenant-pool/tenant-pool.service';
//import { Pool } from 'pg';
//import { decode } from 'he';

@Injectable()
export class ComponentService {

    private readonly logger = new Logger(ComponentService.name);

    constructor(
        private poolService: TenantPoolService,
        private configService: ConfigService
    ) {}


    async getData(params: {db: string}): Promise<ComponentDto[]> {    
        
        const { db } = params;
        
        const pool = this.poolService.getPool(db);

        const query = `SELECT id, name FROM public.components where activ=1 ORDER BY id ASC`;

        try {
            const res = await pool.query(query);

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

    async getItem(params: { id: number, db: string}): Promise<ComponentDto[]> {    
        
        const query = `SELECT * FROM public.components where id=$1 limit 1`;
        
        const { id, db } = params;
        
        const pool = this.poolService.getPool(db);
        
        try {
            const res = await pool.query(query,[id]);

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

