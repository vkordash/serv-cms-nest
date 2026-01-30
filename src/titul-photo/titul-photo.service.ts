import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
//import striptags from 'striptags';
import { ConfigService } from '@nestjs/config';
import { TitulPhotoDto } from './dto/titul-photo.dto';
import { Pool } from 'pg';
import { TenantPoolService } from 'src/tenant-pool/tenant-pool.service';
import { getSrc } from 'src/common/src-img';
//import { decode } from 'he';

@Injectable()
export class TitulPhotoService {

    private readonly logger = new Logger(TitulPhotoService.name);
    
    constructor(
        private poolService: TenantPoolService,
        private configService: ConfigService
    ) {}

    /*private getSrc(src:string){
        
        const SiteUrl = this.configService.get<string>('SITE_URL') ?? null;
        
        if (src.substr(0,2)=="./") {
            return  SiteUrl+src.substr(2); 
        }

        return 'http://192.168.77.253/test_docs/nest/nest_cms/src/'+src;
    }*/

    async getTitPhoto(params: { id: number, db:string }): Promise<TitulPhotoDto[]> {
        
        const SiteUrl = this.configService.get<string>('SITE_URL') ?? null;

        const { id, db } = params;

        const pool = this.poolService.getPool(db);

        if (!id || isNaN(Number(id))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
            // ✅ Получаем все активные элементы, у которых parent = id
            const query = `
                SELECT
                    id_page as id, 
                    src, 
                    alt, 
                    title, 
                    width, 
                    height, 
                    path, 
                    pn 
                FROM photos_new 
                WHERE id_page=${id} 
                ORDER BY pn 
                LIMIT 1              
            `;
            
            const res = await pool.query(query);
            if (res.rowCount == 0)
                return [];
            const rows = res.rows;
            res.rows[0].src = getSrc(res.rows[0].src, SiteUrl);
            return res.rows[0];
        } catch (error) {
            this.logger.error(`❌ Помилка отримання титульного фото (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException('Помилка отримання титульного фото');
        }
    }

    async delete(params: { id: number, db: string }): Promise<{}> {
        
        const { id, db } = params;

        const pool = this.poolService.getPool(db);

        if (!id || isNaN(Number(id))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
            // ✅ Получаем все активные элементы, у которых parent = id
            const query = `
                DELETE FROM photos_new
                WHERE id_page=${id} and id_menu=0
            `;
            const res = await pool.query(query);
            return {};
        } catch (error) {
            this.logger.error(`❌ Помилка вилучення титульного фото (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException('Помилка вилучення титульного фото');
        }
    }

    async update(params: { id:number, title:string, alt:string, height:number, width:number, id_pers: number, db: string }): Promise<{}> {
         
        const { id, title, alt, height, width, id_pers, db } = params;

        const pool = this.poolService.getPool(db);
        
        if (!id || isNaN(Number(id))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
            // ✅ Получаем все активные элементы, у которых parent = id
            const query = `
                UPDATE 
                    photos_new 
                    set 
                    title='${title}', 
                    alt='${alt}', 
                    height=${height}, 
                    width = ${width} 
                WHERE id_page=${id}                
            `;
            console.log(query);
            const res = await pool.query(query);
            return res.rows;
        } catch (error) {
            this.logger.error(`❌ Помилка оновлення титульного фото (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException('Помилка оновлення титульного фото');
        }
    }

    /*async add (params: { PageId: number, file: any}): Promise<{}>  {
       
        const id_org = this.configService.get<string>('ID_ORG') ?? null;

        const { PageId, file } = params;
        
        const path =''+file.path;
        
        try {    
            const _res = await this.pool.query(`delete FROM photos_new WHERE id_page=$1 `,[PageId]);
            const res = await this.pool.query(`
                INSERT INTO
                    photos_new 
                    (id_page, src, width, id_menu,id_org) 
                VALUES (
                    ${PageId},
                    ${path},
                    200,
                    0,
                    ${id_org}
                    )                
                `);
            
           return { message: 'ok' };        

        } catch (error) {
            this.logger.error(`❌ Помилка завантаження титульного фото (id=${PageId}): ${error.message}`, error.stack);
            throw new InternalServerErrorException('Помилка завантаження титульного фото');
        }    
    }*/
}


/********************************* 
class TitPhotoController {
    async add (request, response, next) {
        const PageId =request.body.PageId;
        const file = request.file;
        
        const path =''+file.path; 
        try {    
            const _res = await getPool(request.user.user.db).query(`delete FROM photos_new WHERE id_page=$1 `,[PageId]);
            const query = {
                text: "insert into photos_new (id_page, src, width, id_menu,id_org) values ($1,$2,$3,$4,$5)",
                values: [PageId,path,200,0,_Url.id_org]
            }
            const res = await getPool(request.user.user.db).query(query);
            
            response.status(200).json({ message: 'ok' });        
        }
        catch (err) {
           // return {status : 1, error : e.message};       
           response.status(500).json({ err: `Помилка завантаження титульного фото `+err.message });
        }     
    }
    
    async update (request, response) {

        const { id, title, alt, height, width  } = request.query; 
        try {
            const _title =''+lib.encodeHTML(title); 
            const _alt =''+lib.encodeHTML(alt);                
    
            const query = {
                text: "UPDATE photos_new set title=$1, alt=$2, height=$3, width = $4 where id_page=$5",
                values: [_title, _alt, height, width, id],
              }
            const res = await getPool(request.user.user.db).query(query); 
            
            response.status(200).json(res.rows);    
        } catch (err) {
            console.error(`Error while getting quotes `, err.message);
            response.status(500).json({ error: `Помилка оновлення титульного фото `+err.message });
        }   
    }
    
    
    async del (request, response) {
        //const id = request.query.id;
        const { id } = request.query; 
        try {
            const res = await getPool(request.user.user.db).query(`delete FROM photos_new WHERE id_page=$1 and id_menu=0 `,[id]);
            response.status(200).json({});    
        } catch (err) {
            console.error(`Error while getting quotes `, err.message);
            response.status(500).json({ error: `Помилка видалення титульного фото `+err.message });
        }       
    }
}
*/