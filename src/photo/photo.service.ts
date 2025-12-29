
import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import striptags from 'striptags';
import { ConfigService } from '@nestjs/config';
import { PhotoDto } from './dto/photo.dto';
import { getSrc } from 'src/common/src-img';
import { Pool } from 'pg';
import * as he from 'he';

@Injectable()
export class PhotoService {

    private readonly logger = new Logger(PhotoService.name);

    constructor(
        @Inject('PG_CONNECTION') private readonly pool: Pool,
        private configService: ConfigService
    ) {}

    async getList(params: { id_menu: number, offset:number, limit:number, search?:string }): Promise<PhotoDto> {
        
        const { id_menu, offset, limit, search } = params;

        const BOOL_FIELDS = ['activ', 'show_dt', 'rss', 'soc_nets', 'top'];
        const SiteUrl = this.configService.get<string>('SITE_URL') ?? '';

        if (!id_menu || isNaN(Number(id_menu))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
           
            const query = `
                SELECT 
                    * 
                FROM photos_new 
                WHERE id_menu=${id_menu} 
                ORDER BY create_date DESC 
                LIMIT ${limit} 
                OFFSET ${offset}`;
            
            console.log(query);

            const { rows } = await this.pool.query(query);

            for (const row of rows) {
                row.src = getSrc(row.src, SiteUrl);               
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
                FROM photos_new 
                WHERE id_menu=${id_menu} 
                `;                        
            const { rows } = await this.pool.query(query);
            return rows[0];
        }  catch (error) {
            this.logger.error(`❌ Помилка отримання списку сторінок (id=${id_menu}): ${error.message}`, error.stack);
            throw new InternalServerErrorException('❌ Помилка отримання списку сторінок (id=${id_menu})');
        }   
    }

    async update(params: { id_page: number, name: string, val:string, id_pers: number }){
        
        const { id_page, name, val, id_pers  } = params; 
        
        try {
            
           /*const arrBoolean = ['new_window', 'activ', 'show_name', 'show_dt', 'show_icon'];

            let _val: any;

            // Boolean параметры
            if (arrBoolean.includes(name)) {
                _val = val === 'true' ? 1 : 0;
            }

            // Число
            else if (name === 'pn') {
                _val = Number(val);

                if (Number.isNaN(_val)) {
                    throw new Error(`Parameter "${name}" must be a number`);
                }
            }

            // Строка
            else {
                _val = val.toString();
                if (_val.length == 0) _val = null;
            }*/

            // SQL — только параметизированный!
            const query = `
                UPDATE photos_new
                SET ${name} = $1,
                    last_date = NOW(),
                    last_user = $2
                WHERE id_page = $3
                `;
            console.log(query);
            const res =  await this.pool.query(query, [val, id_pers, id_page]);           
            return res;                      
        } catch (error) {
            this.logger.error(`❌ Помилка update меню (id_page=${id_page}): ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка update меню ${id_page}`);
        }  
    }
}