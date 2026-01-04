import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import striptags from 'striptags';
import { getSrc } from 'src/common/src-img';
import * as he from 'he';
import { Pool } from 'pg';

@Injectable()
export class SliderService {

    private readonly logger = new Logger(SliderService.name);
    
    constructor(
        @Inject('PG_CONNECTION') private readonly pool: Pool,
        private configService: ConfigService
    ) {}

    async getData(params: { id_menu: number, offset:number, limit:number, search?:string }): Promise<any[]> {
        
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
                OFFSET ${offset}
            `;
                          
            console.log(query);
            
            const { rows } = await this.pool.query(query);
            
            for (const row of rows) {
            
                if (row.title)
                    row.title = striptags(he.decode(row.title));
                            
                if (row.head)
                    row.head = striptags(he.decode(row.head));
            
                if (row.text)
                    row.text = striptags(he.decode(row.text));
            
                if (row.v_len > 0) {
                    let p = row.text.indexOf(' ', row.v_len);            
                    row.text = row.text.slice(0,p);
                }
                             
                // --- 3. Преобразование числовых флагов в boolean ---
                for (const key of BOOL_FIELDS) {
                    row[key] = row[key] === 1;
                }
                
                /*row.photo='';
                const resPhoto = await this.pool.query(`SELECT * FROM photos_new WHERE id_page=$1 LIMIT 1`,[row.id]);
                if (resPhoto.rowCount == 1) {
                    row.photo = resPhoto.rows[0];
                    row.photo.src = getSrc(row.photo.src, SiteUrl);                                                       
                } */               
            }
            return rows;                               
        } catch (error) {
            this.logger.error(`❌ Помилка отримання данних слайдера id_menu=${id_menu}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання данних слайдера id_menu:${id_menu} `);
        }
    }

    async getCnt(params: { id_menu: number }): Promise<number> {
        
        const { id_menu } = params;

        if (!id_menu || isNaN(Number(id_menu))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

    
        try {
            const query = `
                SELECT 
                    count (*) as cnt
                FROM pages_new p 
                WHERE id_menu=${id_menu} 
                `;
            
            console.log(query);

            const { rows } = await this.pool.query(query);
            return rows[0]; 
        } catch (error) {
            this.logger.error(`❌ Помилка отримання данних слайдера id_menu=${id_menu}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання данних слайдера id_menu:${id_menu} `);
        }
    }

    async add(params: { id_menu: number, id_pers: number }): Promise<any> {
        
        const { id_menu, id_pers } = params;
        
        const id_org = Number(this.configService.get<string>('ID_ORG')) ?? 0;

        if (!id_menu || isNaN(Number(id_menu))) {
            throw new BadRequestException('Параметр "id_menu" обязателен и должен быть числом');
        }
    
        try {
            const query = `
                INSERT INTO
                    pages_new (
                        id,
                        id_menu,
                        text,
                        create_date,
                        create_user,
                        last_date,
                        last_user,
                        id_org
                        )
                    VALUES (
                        nextval('pages_new_id_seq'),
                        ${id_menu},
                        '...',
                        now(),
                        ${id_pers},
                        now(),
                        ${id_pers},
                        ${id_org}
                    )`;
            
            console.log(query);
            const res = await this.pool.query(query);
            return res; 
        } catch (error) {
            this.logger.error(`❌ Помилка створення нового сладу id_menu= ${id_menu}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка створення нового слайду id_menu: ${id_menu} `);
        }
    }
}