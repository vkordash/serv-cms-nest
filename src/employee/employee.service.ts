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

    async getData(params: { id_pers: number }): Promise<any> {

        const { id_pers } = params;

        try {
            const query = `
                SELECT * 
                FROM employee_new 
                WHERE  id = ${id_pers}`;
            const { rows } = await this.pool.query(query);
            return  rows[0];
        } catch (error) {
            this.logger.error(`❌ Помилка отримання  : ${id_pers}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання  : ${id_pers}`);
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

    async update(params: {
            id_pers: number, 
            name: string, 
            val:string 
        }): Promise<any> {

        const { id_pers, name, val } = params;
        
        try {

            const arrName = ['coname', 'fname', 'lname', 'post', 'email' ];
            if (arrName.includes(name)) { 
                const query = `
                UPDATE 
                    employee_new
                SET ${name} = $1,
                    last_date = now(),
                    last_user = $2
                WHERE id = $3
                `;
                const _arg_upd = [val, id_pers, id_pers];
                console.log(query);
                console.log(_arg_upd);
                const res =  await this.pool.query(query, _arg_upd);           
                return res.rowCount;
            }
            else {
                this.logger.error(`❌ Помилка отримання налаштувань : ${name} не відповідає !`);
                throw new InternalServerErrorException(`Помилка отримання налаштувань : ${name}`);    
            }
            
        } catch (error) {
            this.logger.error(`❌ Помилка отримання налаштувань : ${name}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання налаштувань : ${name}`);
        }              
    }
}   