import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class FileService {

    private readonly logger = new Logger(FileService.name);
    
    constructor(
        @Inject('PG_CONNECTION') private readonly pool: Pool,
        private configService: ConfigService
    ) {}


     async setMenuIcon(id: number, icon:string, id_pers: number, db:string): Promise<any> {
        try {
            const query = 
                `UPDATE 
                    menu_new 
                SET 
                    icon=$2, 
                    last_date = now(),
                    last_user = $3
                WHERE 
                    id=$1`;

            const { res } = await this.pool.query(query,[id, icon, id_pers]);
            return res;                 
        } catch (error) {
            this.logger.error(`❌ Помилка отримання  : ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання  : ${id}`);
        }              
    }

    async setPhotoPage(id: number, src:string, id_pers: number, db:string): Promise<any> {

        //const id_org = this.configService.get<string>('ID_ORG') ?? null;

        try {
            const query = `
                UPDATE pages_new
                SET photo_src = $2,
                    last_date = now(),
                    last_user = $3
                WHERE id = $1
                RETURNING photo_src 
                `;
            const { rows }  = await this.pool.query(query, [id, src, id_pers]);
            console.log(query);
            return rows[0];                 
        } catch (error) {
            this.logger.error(`❌ Помилка отримання  : ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання  : ${id}`);
        }              
    }

    async uploadPhoto(id: number, src:string, id_pers: number, id_org: number, db:string): Promise<any> {

        try {
            //const id_org = this.configService.get<string>('ID_ORG') ?? null;

            const query = `
                INSERT INTO 
                    public.photos_new (
                        id, 
                        id_menu, 
                        photo_src,
                        create_user,
                        last_user,
                        id_org
                    )
	            VALUES (
                    nextval('pages_new_id_seq'), 
                    $1, 
                    $2, 
                    $3, 
                    $4, 
                    $5); 
                `;
            const { rows }  = await this.pool.query(query, [id, src, id_pers, id_pers, id_org]);
            return rows;                 
        } catch (error) {
            this.logger.error(`❌ Помилка отримання  : ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання  : ${id}`);
        }              
    }



    /*async setPhotoPage(id: number, src:string): Promise<any> {

        const id_org = this.configService.get<string>('ID_ORG') ?? null;

        try {
            const query_del = 
                `DELETE 
                    FROM photos_new 
                    WHERE id_page=${id}`;
            const  res_del = await this.pool.query(query_del);   
            console.log(query_del);     
            const query = 
                `INSERT INTO
                    photos_new (
                        id_page,
                        src, 
                        width, 
                        id_menu,
                        id_org) 
                    VALUES  (${id},'${src}',200,0,${id_org})`;

            const  res  = await this.pool.query(query);
            console.log(query);
            return src;                 
        } catch (error) {
            this.logger.error(`❌ Помилка отримання  : ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання  : ${id}`);
        }              
    }*/

    async setPhotoVideoCollection(id: number, icon:string, id_pers: number, db:string): Promise<any> {
        try {
            const query = 
                `UPDATE 
                    menu_new 
                SET icon='${icon}' 
                WHERE id=${id}`;

            const { res } = await this.pool.query(query);
            return res;                 
        } catch (error) {
            this.logger.error(`❌ Помилка отримання  : ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання  : ${id}`);
        }              
    }

    async setPhotoSliderPage(id: number, icon:string, id_pers: number, db:string): Promise<any> {
        try {
            const query = 
                `UPDATE 
                    page_new 
                SET icon='${icon}' 
                WHERE id=${id}`;

            const { res } = await this.pool.query(query);
            return res;                 
        } catch (error) {
            this.logger.error(`❌ Помилка отримання  : ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання  : ${id}`);
        }              
    }

    async setPhotoSliderBaner(id: number, icon:string, id_pers: number, db:string): Promise<any> {
       /* try {
            const query = 
                `UPDATE 
                    menu_new 
                SET icon='${icon}' 
                WHERE id=${id}`;

            const { res } = await this.pool.query(query);
            return res;                 
        } catch (error) {
            this.logger.error(`❌ Помилка отримання  : ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання  : ${id}`);
        }    */          
    }

    async setPhotoCollection(id: number, src:string, id_pers: number, id_org: number, db:string): Promise<any> {

        //const id_org = this.configService.get<string>('ID_ORG') ?? null;

        try {

            const _query = `select nextval('pages_new_id_seq')`;  
            const _res = await this.pool.query(_query);
            const id_page  = _res.rows[0].nextval;

            const query_page = `
                INSERT INTO 
                    pages_new (
                        id, 
                        id_menu, 
                        text
                    ) 
                VALUES (
                    ${id_page},
                    ${id},
                    '....'
                )`;                 
            const res_page = await this.pool.query(query_page);

            const query = 
                `INSERT INTO
                    photos_new (
                        id_page,
                        src, 
                        width, 
                        id_menu,
                        alt,
                        title,
                        id_org) 
                    VALUES  (${id_page},'${src}',200,${id},'...','...',${id_org})`;

            const  res  = await this.pool.query(query);
            console.log(query);
            return src;                 
        } catch (error) {
            this.logger.error(`❌ Помилка отримання  : ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання  : ${id}`);
        }              
    }

    async saveFiles(files, {id,id_component}) {

    }
      
}