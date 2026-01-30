import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenantPoolService } from 'src/tenant-pool/tenant-pool.service';
//import { Pool } from 'pg';


@Injectable()
export class AccessService {

    private readonly logger = new Logger(AccessService.name);
    
    constructor(
        private poolService: TenantPoolService,
        private configService: ConfigService
    ) {}

    async getData(params: { id_menu: number, db: string }): Promise<any> {
        
        const { id_menu, db } = params;
    
        const pool = this.poolService.getPool(db);


        if (!id_menu || isNaN(Number(id_menu))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }
            
        try {
            const query = `
                SELECT
                    id, (coalesce(coname,' ') || ' ' || coalesce(substring(fname,1,1),'.') || '. ' || coalesce(substring(lname,1,1),'.')|| '. ') as full_name 
                FROM
                    employee_new 
                WHERE 
                    id in (select id_user from access_new where id_menu=${id_menu} and rw=1)
            `;                    
            const { rows } = await pool.query(query);
            return  rows;                 
        } catch (error) {
            this.logger.error(`❌ Помилка отримання списку доступних пунктів меню id_menu=${id_menu} : ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання списку тегів id_menu:${id_menu} `);
        }
    }

    async add (params: { id_menu: number, id_user: number, db: string }): Promise<any> {
        
        const { id_menu, id_user, db } = params;
    
        const pool = this.poolService.getPool(db);

        if (!id_menu || isNaN(Number(id_menu))) {
            throw new BadRequestException('Параметр "id_menu" обязателен и должен быть числом');
        }

        if (!id_user || isNaN(Number(id_user))) {
            throw new BadRequestException('Параметр "id_user" обязателен и должен быть числом');
        }
            
        try {            
            const query = `
                INSERT INTO 
                    access_new (
                        id_menu,
                        id_user,
                        rw) 
                VALUES (
                    ${id_menu},
                    ${id_user},
                    1
                )`;  

            this.recurs_insert(id_menu,id_user, db);  
            const res = await pool.query(query);
            return  res;                 
        } catch (error) {
            this.logger.error(`❌ Помилка отримання списку доступних пунктів меню id_menu=${id_menu} : ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання списку тегів id_menu:${id_menu} `);
        }
    }

    async delete(params: { id_menu: number, id_user:number, db: string }): Promise<any> {
        
        const { id_menu, id_user, db } = params;
    
        const pool = this.poolService.getPool(db);

        if (!id_menu || isNaN(Number(id_menu))) {
            throw new BadRequestException('Параметр "id_menu" обязателен и должен быть числом');
        }

        if (!id_user || isNaN(Number(id_user))) {
            throw new BadRequestException('Параметр "id_user" обязателен и должен быть числом');
        }
            
        try {
            const query = `
                DELETE FROM 
                    access_new 
                WHERE 
                    id_menu=${id_menu} 
                    and id_user=${id_user} 
                    and rw=1
            `;
            this.recurs_delete(id_menu,id_user, db);                    
            const res = await pool.query(query);
            return res;                 
        } catch (error) {
            this.logger.error(`❌ Помилка отримання списку доступних пунктів меню id_menu=${id_menu} : ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання списку тегів id_menu:${id_menu} `);
        }
    }

    private async recurs_delete(id_menu:number, id_user:number, db: string){
        if (id_menu==0) return;
        
        const pool = this.poolService.getPool(db);

        const _res_submenu = await pool.query(`select count(*) as cnt from access_new where id_menu=$1 and id_user=$2 and rw=0`,[id_menu,id_user]); 
        // проверка доступа на субменю 'вложения вниз'
        if (_res_submenu.rows[0]==1){
            //есть субменю. Выходим       
            return;
        }
        else {
            const _res = await pool.query(`select parent from menu_new where id=$1`,[id_user]); 
            const parent = _res.rows[0]['parent'];
            // console.log(parent);
            if (parent==0) return;
            else {
                const res = await pool.query(`delete from access_new where id_menu=$1 and id_user=$2 and rw=0`,[parent,id_user]); 
                const _res_parent = await pool.query(`select count(*) as cnt from access_new where id_menu=$1 and id_user=$2 and rw=1`,[parent,id_user]);
                if (_res_parent.rows[0]==1){                
                    return
                }
                else this.recurs_delete(parent,id_user, db);
            }    
        } 
    }

    private async recurs_insert(id_menu: number, id_user: number, db: string){
    
        const pool = this.poolService.getPool(db);

        const _res = await pool.query(`select parent from menu_new where id=$1`,[id_menu]); 
        const parent = _res.rows[0]['parent'];
        console.log(parent);
        if (parent==0) return;
        else {
            this.recurs_insert(parent,id_user, db);
            const _res1 = await pool.query.query(`select count(*) as cnt from access_new where id_menu=$1 and id_user=$2 and rw=0`,[parent,id_user]);          
            if (_res1.rows[0]['cnt']==0)
            {
                const _res2 =  await pool.query(`insert into access_new (id_menu,id_user, rw) values ($1,$2,$3)`,[parent , id_user, 0]);    
            }    
        }    
    };
}


