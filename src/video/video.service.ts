import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import striptags from 'striptags';
import { VideoDto } from './dto/video.dto';
import * as he from 'he';
import { Pool } from 'pg';
import { getSrc } from 'src/common/src-img';


@Injectable()
export class VideoService {

    private readonly logger = new Logger(VideoService.name);
    
    constructor(
        @Inject('PG_CONNECTION') private readonly pool: Pool,
        private configService: ConfigService
    ) {}
    
    async getList(params: { id_menu: number, offset:number, limit:number, search?:string }): Promise<VideoDto[]> {
            
            const { id_menu, offset, limit, search } = params;
    
            const BOOL_FIELDS = ['activ', 'show_dt', 'rss', 'soc_nets', 'sl_main','sl_news','sl_pages','sl_banners','new_window'];
            const SiteUrl = this.configService.get<string>('SITE_URL') ?? '';
    
            if (!id_menu || isNaN(Number(id_menu))) {
                throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
            }
    
            try {
               
                const query = `
                    SELECT 
                        id,
                        head,
                        title,
                        date,
                        text,
                        v_len,
                        activ,
                        link_frame,
                        rss, 
                        soc_nets, 
                        sl_main, 
                        sl_news,
                        sl_pages,
                        sl_banners,
                        new_window, 
                        show_dt, 
                        v_len,
                        photo_src
                    FROM pages_new p 
                    WHERE id_menu=${id_menu} 
                    ORDER BY create_date DESC 
                    LIMIT ${limit} 
                    OFFSET ${offset}`;
                
                console.log(query);
    
                const { rows } = await this.pool.query(query);
    
                for (const row of rows) {
                        
                    if (row.title)
                        row.title = striptags(he.decode(row.title));
                    
                    if (row.head)
                        row.head = striptags(he.decode(row.head));
    
                    if (row.text)
                        row.text = striptags(he.decode(row.text));

                    if (row.link_frame)
                        row.link_frame = he.decode(row.link_frame);
    
                    if (row.v_len > 0) {
                        let p = row.text.indexOf(' ', row.v_len);            
                        row.text = row.text.slice(0,p);
                    }
                     
                    // --- 3. Преобразование числовых флагов в boolean ---
                    for (const key of BOOL_FIELDS) {
                        row[key] = row[key] === 1;
                    }
        
                   /* if (row.photo) {
                        row.photo = getSrc(row.photo, SiteUrl);
                        
                    }  */                       
                }
                return rows;
            }  catch (error) {
                this.logger.error(`❌ Помилка отримання списку сторінок (id=${id_menu}): ${error.message}`, error.stack);
                throw new InternalServerErrorException('❌ Помилка отримання списку сторінок (id=${id_menu})');
            }   
        }
    
        async getCnt(params: { id_menu: number, search?:string }): Promise<Number> {
            
            const { id_menu, search } = params;
    
            if (!id_menu || isNaN(Number(id_menu))) {
                throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
            }
    
            try {           
                const query = `
                    SELECT 
                        count(*) as cnt 
                    FROM pages_new 
                    WHERE id_menu=${id_menu} 
                    `;                        
                const { rows } = await this.pool.query(query);
                return rows[0];
            }  catch (error) {
                this.logger.error(`❌ Помилка отримання списку сторінок (id=${id_menu}): ${error.message}`, error.stack);
                throw new InternalServerErrorException('❌ Помилка отримання списку сторінок (id=${id_menu})');
            }   
        }

        async add(params: { id_menu: number, id_pers: number}): Promise<any> {
            
            const { id_menu, id_pers } = params;
            
            const id_org = Number(this.configService.get<string>('ID_ORG')) ?? 0;

            if (!id_menu || isNaN(Number(id_menu))) {
                throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
            }
    
            try {   
                const query = `
                    INSERT INTO 
                        pages_new 
                        (id,
                        id_menu,
                        text,
                        create_date,
                        create_user,
                        last_date,
                        last_user,
                        id_org)
                    VALUES (
                        nextval('pages_new_id_seq'),
                        ${id_menu},
                        '...',
                        NOW(),
                        ${id_pers},
                        NOW(),
                        ${id_pers},
                        ${id_org})                    
                    `;         
                const res = await this.pool.query(query);
                return res;
            }  catch (error) {
                this.logger.error(`❌ Помилка отримання списку сторінок (id_menu=${id_menu}): ${error.message}`, error.stack);
                throw new InternalServerErrorException('❌ Помилка отримання списку сторінок (id_menu=${id_menu})');
            }  
        }

        async delete(params: { id: number, id_pers : number }): Promise<any> {
            
          /*  const { id_menu, search } = params;
    
            if (!id_menu || isNaN(Number(id_menu))) {
                throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
            }
    
            try {           
                const query = `
                    SELECT 
                        count(*) as cnt 
                    FROM pages_new 
                    WHERE id_menu=${id_menu} 
                    `;                        
                const { rows } = await this.pool.query(query);
                return rows[0];
            }  catch (error) {
                this.logger.error(`❌ Помилка отримання списку сторінок (id=${id_menu}): ${error.message}`, error.stack);
                throw new InternalServerErrorException('❌ Помилка отримання списку сторінок (id=${id_menu})');
            }   */
        }

        async update(params: { id: number, name:string, val:string, id_pers: number }): Promise<any> {
            
            const { id, name, val, id_pers } = params;
                
            if (!id || isNaN(Number(id))) {
                throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
            }
            
            const BOOLEAN_FIELDS = new Set(['activ', 'show_dt', 'rss', 'soc_nets', 'sl_main','sl_news','sl_pages','sl_banners','new_window']);
            const TEXT_FIELDS = new Set(['head', 'text', 'title']);
            const NUMBER_FIELDS = new Set(['v_len']);
            const DATE_FIELDS = new Set(['date']);

            // 🔒 whitelist всех разрешённых полей
            const ALLOWED_FIELDS = new Set([
            ...BOOLEAN_FIELDS,
            ...TEXT_FIELDS,
            ...NUMBER_FIELDS,
            ...DATE_FIELDS,
            ]);

            if (!ALLOWED_FIELDS.has(name)) {
                throw new BadRequestException(`Недопустиме поле: ${name}`);
            }
            
            // 🔄 Преобразование значения
            let value: any;

            if (BOOLEAN_FIELDS.has(name)) {
                value = val === 'true' ? 1 : 0;
            } 
            else if (NUMBER_FIELDS.has(name)) {
                value = Number(val);
            if (Number.isNaN(value)) {
                throw new BadRequestException(`Поле ${name} повинно бути числом`);
            }
            }
            else if (DATE_FIELDS.has(name)) {
                const date = new Date(val);
                if (isNaN(date.getTime())) {
                    throw new BadRequestException(`Некорректна дата`);
                }
                value = `'`+date.toISOString()+`'`;
            }
            else if (TEXT_FIELDS.has(name)) {
                value = `'`+String(val)+`'`;
            }

            try {           
                const query = `
                   UPDATE pages_new 
                   SET ${name}=${value},
                   last_date = NOW(),
                   last_user = ${id_pers}
                   WHERE id=${id} 
                    `;
                console.log(query);                        
                const res = await this.pool.query(query);
                return res;
            }  catch (error) {
                this.logger.error(`❌ Помилка отримання списку сторінок (id=${id}): ${error.message}`, error.stack);
                throw new InternalServerErrorException('❌ Помилка отримання списку сторінок (id=${id})');
            }   
        }
}
