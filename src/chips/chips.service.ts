import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
//import striptags from 'striptags';
import { ConfigService } from '@nestjs/config';
import { TenantPoolService } from 'src/tenant-pool/tenant-pool.service';
//import { chips.dto } from './dto/menuItem.dto';
//import { Pool } from 'pg';
//import { decode } from 'he';

@Injectable()
export class ChipsService {

    private readonly logger = new Logger(ChipsService.name);
    
    constructor(
        private poolService: TenantPoolService,
        private configService: ConfigService
    ) {}

    async getData(params: { id: number, id_component : number, db:string }): Promise<string[]> {
            const { id, id_component, db } = params;
    
            const pool = this.poolService.getPool(db);

            if (!id || isNaN(Number(id))) {
                throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
            }
            if (!id_component || isNaN(Number(id_component))) {
                throw new BadRequestException('Параметр "id_component" обязателен и должен быть числом');
            }
    
            try {
                // ✅ Получаем все активные элементы, у которых parent = id
                const query = `
                    SELECT 
                        name 
                    FROM tags 
                    WHERE  id in (select id_tag from link_tags where id_component=${id_component} and link_tags.id=${id})`;                
                const { rows } = await pool.query(query);
                return  rows.map((item)=>item['name']);                 
            } catch (error) {
                this.logger.error(`❌ Помилка отримання списку тегів id=${id}  id:component:${id_component}: ${error.message}`, error.stack);
                throw new InternalServerErrorException(`Помилка отримання списку тегів id:${id} id:component:${id_component}`);
            }
        }
    
    async delete(params: { id: number, id_component : number, name : string, db:string }): Promise<any> {
            
        const { id, id_component, name, db } = params;
    
        const pool = this.poolService.getPool(db);

            if (!id || isNaN(Number(id))) {
                throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
            }
            if (!id_component || isNaN(Number(id_component))) {
                throw new BadRequestException('Параметр "id_component" обязателен и должен быть числом');
            }
    
            try {
                // ✅ Получаем все активные элементы, у которых parent = id
                const query = `
                    DELETE FROM 
                        link_tags 
                    WHERE
                        id=${id} 
                        and id_component=${id_component} 
                        and id_tag = (
                            SELECT
                                id from tags 
                            WHERE
                                name='${name}' 
                            LIMIT 1)
                `;
                const res = await pool.query(query);
                return  res;                 
            } catch (error) {
                this.logger.error(`❌ Помилка вилучення тегу id=${id}  id:component:${id_component}  name ${name}: ${error.message}`, error.stack);
                throw new InternalServerErrorException(`Помилка вилучення тегу id:${id} id:component:${id_component} name ${name}`);
            }
        }
    
    async add(params: { id: number, id_component : number, name : string, db:string }): Promise<any> {
            
        const { id, id_component, name, db } = params;
    
        const pool = this.poolService.getPool(db);

            if (!id || isNaN(Number(id))) {
                throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
            }
            if (!id_component || isNaN(Number(id_component))) {
                throw new BadRequestException('Параметр "id_component" обязателен и должен быть числом');
            }
    
            try {
                // ✅ Получаем все активные элементы, у которых parent = id
                
                const res0 =  await pool.query(`select id from tags where name=$1 limit 1`,[name]);
                if (res0.rowCount == 0) {
                    // Такого название в справочнике тегов нет
                    //Добавляем слово в cправочник
                    const res1 = await pool.query(`select nextval('tags_id_seq')`);  
                    var id_tag  = res1.rows[0].nextval;
                    const res2 =  await pool.query(`insert into tags (id,name) values ($1,$2)`,[id_tag, name]);          
                }
                else {
                    var id_tag = res0.rows[0].id;    
                }
                const res3 =  await pool.query(`select count(*) from link_tags where id=$1 and id_component=$2 and id_tag=$3`,[id,id_component,id_tag]);
                if (res3.rows[0].count == 0) {
                    const res4 =  await pool.query(`insert into link_tags (id,id_component,id_tag) values ($1,$2,$3)`,[id,id_component,id_tag]);                         
                }
                return  true;                 
            } catch (error) {
                this.logger.error(`❌ Помилка вилучення тегу id=${id}  id:component:${id_component}  name ${name}: ${error.message}`, error.stack);
                throw new InternalServerErrorException(`Помилка вилучення тегу id:${id} id:component:${id_component} name ${name}`);
            }
        }
}
