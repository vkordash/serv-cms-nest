import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class EmployeeService {

    private readonly logger = new Logger(EmployeeService.name);
    
    constructor(
        @Inject('PG_CONNECTION') private readonly pool: Pool,
        private configService: ConfigService
    ) {}

    async getData(params: { id: number }): Promise<any> {

        const { id } = params;

        try {
            const query = `
                SELECT * 
                FROM employee_new 
                WHERE  id = ${id}`;
            const { rows } = await this.pool.query(query);
            return  rows[0];
        } catch (error) {
            this.logger.error(`❌ Помилка отримання  : ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання  : ${id}`);
        }              
    }

    async getAccess(params: {id: number}): Promise<any> {

        const { id } = params;

        try {
            const query = `
                SELECT 
                    id as value,
                    (coalesce(coname,' ') || ' ' || coalesce(substring(fname,1,1),'.') || '. ' || coalesce(substring(lname,1,1),'.')|| '. ') as full_name 
                FROM
                    employee_new 
                WHERE 
                    id not in (select id_user from access_new where id_menu=${id}) 
                ORDER  by full_name
                `;
            const { rows } = await this.pool.query(query);
            return  rows;
        } catch (error) {
            this.logger.error(`❌ Помилка отримання  : ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання  : ${id}`);
        } 
    }
}