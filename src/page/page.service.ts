import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import striptags from 'striptags';
import { ConfigService } from '@nestjs/config';
import { PageDto } from './dto/page.dto';
import { Pool } from 'pg';
import * as he from 'he';

@Injectable()
export class PageService {

    private readonly logger = new Logger(PageService.name);

    private updateWebDocs = (str:string) => {
        const SiteUrl = this.configService.get<string>('SITE_URL') ?? null;
        if (SiteUrl) {
            while (str.indexOf('src="./web_docs')>=0) {
                str = str.replace('src="./web_docs', 'src="'+SiteUrl+'web*docs');
                console.log('./web_docs');
            }
                
            while (str.indexOf('src="/web_docs')>=0) {
                str = str.replace('src="/web_docs', 'src="'+SiteUrl+'web*docs');
                console.log('/web_docs');
            }
                        
            while (str.indexOf('web_docs')>=0) {
                str = str.replace('web_docs', SiteUrl+'web*docs');
                console.log('web_docs');
            }
                        
            while (str.indexOf('web*docs')>=0) {
                str = str.replace('web*docs', 'web_docs');            
            }

        }       
        return str;
    }

    constructor(
        @Inject('PG_CONNECTION') private readonly pool: Pool,
        private configService: ConfigService
    ) {}

    async getPage(params: { id: number, tp:number }): Promise<PageDto> {
        const { id, tp } = params;

        if (!id || isNaN(Number(id))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
           
            const query = tp==1 ? 
                `SELECT id, head, title, text, create_date as date,id_menu FROM pages_new WHERE id_menu=${id} ORDER BY create_date DESC LIMIT 1`
                : `SELECT id, head, title, text, create_date as date,id_menu FROM pages_new WHERE id=${id} ORDER BY create_date DESC LIMIT 1`
           
            const { rows } = await this.pool.query(query);
            let page=rows[0];
            if (page!=undefined) {
                if (page.head)
                    page.head = he.decode(page.head);

                if (page.title)
                    page.title = he.decode(page.title);
                
                if (page.text)
                    page.text = he.decode(page.text);
                //    page.text = this.updateWebDocs(page.text); 
                return page;                 
            }            
            else
                page = (tp == 1) ?
                    {id : 0, title : '',  id_menu: id,  head: '', text : '', date : ''}            
                    : {id : 0, title : '',  text : '',  head: '', date : ''}
                     
                 return page;

        }  catch (error) {
            this.logger.error(`❌ Ошибка при построении меню (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException('Ошибка при построении меню');
        }   
    }

    async getList(params: { id_menu: number, offset:number, limit:number, search?:string }): Promise<PageDto> {
        
        const { id_menu, offset, limit, search } = params;

        const BOOL_FIELDS = ['activ', 'show_dt', 'rss', 'soc_nets', 'sl_main','sl_news','sl_pages','sl_banners','new_window'];
        const siteUrl = this.configService.get<string>('SITE_URL') ?? '';

        if (!id_menu || isNaN(Number(id_menu))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
           
           /* const query = `
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
                    top, 
                    show_dt, 
                    v_len,
                    (SELECT src FROM photos_new WHERE id_page=p.id ) as photo
                FROM pages_new p 
                WHERE id_menu=${id_menu} 
                ORDER BY create_date DESC 
                LIMIT ${limit} 
                OFFSET ${offset}`;*/
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

                if (row.v_len > 0) {
                    let p = row.text.indexOf(' ', row.v_len);            
                    row.text = row.text.slice(0,p);
                }
                 
                // --- 3. Преобразование числовых флагов в boolean ---
                for (const key of BOOL_FIELDS) {
                    row[key] = row[key] === 1;
                }
    
                /*if (row.photo) {
                    if (siteUrl){
                        row.photo = siteUrl+row.photo.substr(2);
                    }                                        
                } */                
            }
            return rows;
        }  catch (error) {
            this.logger.error(`❌ Помилка отримання списку сторінок (id=${id_menu}): ${error.message}`, error.stack);
            throw new InternalServerErrorException('❌ Помилка отримання списку сторінок (id=${id_menu})');
        }   
    }

    async getCnt(params: { id_menu: number, search?:string }): Promise<PageDto> {
        
        const { id_menu, search } = params;

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
        }  catch (error) {
            this.logger.error(`❌ Помилка отримання списку сторінок (id=${id_menu}): ${error.message}`, error.stack);
            throw new InternalServerErrorException('❌ Помилка отримання списку сторінок (id=${id_menu})');
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
                        date,
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

    async update(params: { id_page: number, name: string, val:string, id_pers:number }){
        
        const { id_page, name, val, id_pers  } = params; 
        const last_user = '9999'; //request.user.user.id_pers
        try {
            
            let _val: any;

            const arrBoolean = ['activ', 'show_dt', 'rss', 'soc_nets', 'sl_main','sl_news','sl_pages','sl_banners','new_window'];
            const arrNumber = ['v_len', 'link_tag','pn' ];
            const arrDate = ['date'];

            // Boolean параметры
            if (arrBoolean.includes(name)) {
                _val = val === 'true' ? 1 : 0;
            }

            // Число
            else if (arrNumber.includes(name)) {
                _val = Number(val);               
            }
            // Дата
            else if (arrDate.includes(name)) {
                let date  = new Date(val);
                
                if (Number.isNaN(date.getTime())) {
                   throw new BadRequestException('Invalid date format');
                }

                _val = date .toISOString();           
            }
            // Строка
            else {
                _val = val.toString();
                if (_val.length == 0) _val = null;
            }

            // SQL — только параметизированный!
            const query = `
                UPDATE pages_new
                SET ${name} = $1,
                    last_date = now(),
                    last_user = $2
                WHERE id = $3
                `;
            const res =  await this.pool.query(query, [_val, last_user, id_page]);           
            return res.rowCount;                      
        } catch (error) {
            this.logger.error(`❌ Помилка update меню (id=${id_page}): ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка update меню ${id_page}`);
        }  
    }

    async getPref(params: { id: number }): Promise<any> {
        
        const { id } = params;

        if (!id || isNaN(Number(id))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
           
            const query = `
                SELECT
                    id, 
                    photo_src,
                    photo_alt,
                    photo_title,
                    seo_title,
                    seo_description,
                    seo_keywords,
                    seo_robots,
                    seo_canonical,
                    seo_opengraph,
                    (SELECT coname || ' ' || fname || ' ' || lname from employee_new where id=create_user) as create_user_name,
                    create_date,
                    (SELECT coname || ' ' || fname || ' ' || lname from employee_new where id=last_user) as last_user_name,
                    last_date
                FROM pages_new 
                WHERE id=${id} 
                LIMIT 1
                `;
            
            console.log(query);

            const { rows } = await this.pool.query(query);

            return rows[0];
        }  catch (error) {
            this.logger.error(`❌ Помилка отримання списку сторінок (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException('❌ Помилка отримання списку сторінок (id=${id})');
        }   
    }


    async getListVideo(params: { id_menu: number, offset:number, limit:number, search?:string }): Promise<PageDto> {
        
        const { id_menu, offset, limit, search } = params;

        const BOOL_FIELDS = ['activ', 'show_dt', 'rss', 'soc_nets', 'sl_main','sl_news','sl_pages','sl_banners','new_window'];
        
        const siteUrl = this.configService.get<string>('SITE_URL') ?? '';

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
                    link_frame,
                    v_len,
                    activ,
                    rss, 
                    soc_nets, 
                    top, 
                    show_dt,                     
                    (SELECT src FROM photos_new WHERE id_page=p.id ) as photo
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

                if (row.v_len > 0) {
                    let p = row.text.indexOf(' ', row.v_len);            
                    row.text = row.text.slice(0,p);
                }
                 
                // --- 3. Преобразование числовых флагов в boolean ---
                for (const key of BOOL_FIELDS) {
                    row[key] = row[key] === 1;
                }
    
                if (row.photo) {
                    if (siteUrl){
                        row.photo = siteUrl+row.photo.substr(2);
                    }                                        
                }                 
            }
            return rows;
        }  catch (error) {
            this.logger.error(`❌ Помилка отримання списку  відео фреймів (id=${id_menu}): ${error.message}`, error.stack);
            throw new InternalServerErrorException('❌ Помилка отримання списку відео фреймів (id=${id_menu})');
        }   
    }
    
    async delTitulPhoto(params: { id: number, id_pers:number }): Promise<PageDto> {
        const { id, id_pers } = params;

        if (!id || isNaN(Number(id))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
           const query = `
                UPDATE pages_new
                SET photo_src = null,
                    photo_alt = null,
                    photo_title = null,
                    last_date = now(),
                    last_user = $2
                WHERE id = $1
                `;
            const { rows }  = await this.pool.query(query, [id, id_pers]);
            console.log(query);
            return rows[0]; 
           

        }  catch (error) {
            this.logger.error(`❌ Ошибка при построении меню (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException('Ошибка при построении меню');
        }   
    }
}