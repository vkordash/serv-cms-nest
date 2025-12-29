import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
//import striptags from 'striptags';
import { ConfigService } from '@nestjs/config';
import { MenuItemDto } from './dto/menuItem.dto';
import { Pool } from 'pg';
import { resolveObjectURL } from 'buffer';
//import { decode } from 'he';
import { getSrc } from 'src/common/src-img';

@Injectable()
export class MenuService {

    private readonly logger = new Logger(MenuService.name);

    constructor(
        @Inject('PG_CONNECTION') private readonly pool: Pool,
        private configService: ConfigService
    ) {}

    async getMenu(params: { id: number }): Promise<MenuItemDto[]> {
        const { id } = params;

        if (!id || isNaN(Number(id))) {
        throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
            // ✅ Получаем все активные элементы, у которых parent = id
            const query = `
                SELECT  
                    id as key, 
                    name as label, 
                    routerlink as url, 
                    id_component, 
                    activ, 
                    (SELECT coname || ' ' || fname || ' ' || lname from employee_new where id=create_user) as create_user_name,    
                    (SELECT coname || ' ' || fname || ' ' || lname from employee_new where id=last_user) as last_user_name,
                    (select icon from components where components.id =id_component) as icon, 
                    (select link from components where components.id =id_component) as url
                FROM menu_new 
                WHERE parent = ${id} 
                ORDER BY pn
                
            `;
            
            const res = await this.pool.query(query);
            if (res.rowCount == 0)
                return [];
            const rows = res.rows;
            // ✅ Для каждого элемента находим дочерние элементы (рекурсия)
            const result = await Promise.all(
                rows.map(async (row) => {
                
                const SiteUrl = this.configService.get<string>('SITE_URL') ?? '';

                const children = await this.getMenu({ id: row.key }); // 🔁 рекурсивный вызов                

                return {
                    key: row.key,
                    label: row.label,
                    url: '/'+row.url,
                    id_component:row.id_component,
                    activ: row.activ,
                    icon:  row.icon,
                    children: children.length > 0 ? children : undefined, // ✅ если есть подменю
                    };
                }),
            );
            return result;
        } catch (error) {
            this.logger.error(`❌ Ошибка при построении меню (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException('Ошибка при построении меню');
        }
    }

    async update(params: { id: number, name: string, val:string, id_pers: number }){
        
        const { id, name, val, id_pers  } = params; 
        
        try {
            
           const arrBoolean = ['new_window', 'activ', 'show_name', 'show_dt', 'show_icon'];

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
            }

            // SQL — только параметизированный!
            const query = `
                UPDATE menu_new
                SET ${name} = $1,
                    last_date = NOW(),
                    last_user = $2
                WHERE id = $3
                `;
            const res =  await this.pool.query(query, [_val, id_pers, id]);           
            return res.rowCount;                      
        } catch (error) {
            this.logger.error(`❌ Помилка update меню (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка update меню ${id}`);
        }  
    }

    async getMenuItem(params: { id: number }): Promise<MenuItemDto> {
        const { id } = params;

        if (!id || isNaN(Number(id))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
            // ✅ Получаем все активные элементы, у которых parent = id
            const query = `
                SELECT  
                    id as key, name, pn, routerlink, id_component, new_window 
                FROM menu_new 
                WHERE id = ${id} 
                LIMIT 1`;
            
            const { rows } = await this.pool.query(query);
            return rows;
        } catch (error) {
            this.logger.error(`❌ Ошибка получения меню (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Ошибка получения меню ${id}`);
        }
    }

    async getMenuById(params: { id: number }): Promise<MenuItemDto> {
        
        const { id } = params;
        
        const SiteUrl = this.configService.get<string>('SITE_URL') ?? '';
        
        if (!id || isNaN(Number(id))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
            // ✅ Получаем все активные элементы, у которых parent = id
            const query = `
                SELECT 
                    id, 
                    parent, 
                    name, 
                    icon, 
                    id_component, 
                    routerlink, 
                    new_window, 
                    pn, 
                    activ, 
                    show_name, 
                    show_dt, 
                    show_icon, 
                    last_user, 
                    last_date, 
                    create_date, 
                    create_user, 
                    id_site, 
                    old_parent,
                    (SELECT coname || ' ' || fname || ' ' || lname from employee_new where id=create_user) as create_user_name,    
                    (SELECT coname || ' ' || fname || ' ' || lname from employee_new where id=last_user) as last_user_name
                FROM menu_new 
                WHERE id = ${id} 
                LIMIT 1`;            
            const { rows } = await this.pool.query(query);
            //console.log(rows);
            if (rows[0].icon) 
                rows[0].icon = getSrc(rows[0].icon, SiteUrl);
            //console.log(rows);
            return rows;
        } catch (error) {
            this.logger.error(`❌ Ошибка получения меню (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Ошибка получения меню ${id}`);
        }
    }

    async getSubMenu (params: { id: number }): Promise<MenuItemDto> {
        
        const { id } = params;
        const siteUrl = this.configService.get<string>('SITE_URL') ?? '';

        if (!id || isNaN(Number(id))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
            // ✅ Получаем все активные элементы, у которых parent = id
            const query = `
                SELECT 
                    id, 
                    parent, 
                    name, 
                    icon, 
                    routerlink as url, 
                    id_component , 
                    new_window, 
                    show_name, 
                    show_dt, 
                    show_icon, 
                    (select link from components where id=id_component) as routerLink 
                FROM menu_new 
                WHERE parent = ${id}  and activ='t' 
                ORDER BY  pn`;
            
                //console.log(query);
            
                const { rows } = await this.pool.query(query);
               // console.log(rows);

            for (const row of rows) {
                
                if (row.url==='') {
                    row.routerlink ='/'+row.routerlink
                    if (row.id_component==1){
                        row.queryParams = {'id':row.id,"tp":1};             
                    }
                    else row.queryParams = {'id':row.id};  
                }
                else 
                    if (row.url)
                        row.routerlink = row.url.replace(siteUrl, '');        
                    else row.url='';
                               
                if (row.url==='single_page.php') {
                    row.url='';
                    if (row.id_component==1){
                        row.routerlink ='/page';
                        row.queryParams = {'id':row.id,"tp":1};             
                    }                
                }               
            } 
            return rows;
        } catch (error) {
            this.logger.error(`❌ Ошибка получения меню (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Ошибка получения меню ${id}`);
        }
    }

    async getTreeItem (params: { id: number }): Promise<any> {
        
        const { id } = params;
        const siteUrl = this.configService.get<string>('SITE_URL') ?? '';

        if (!id || isNaN(Number(id))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
            // ✅ Получаем все активные элементы, у которых parent = id
            const query = `
                SELECT 
                    id as key,
                    name as label,
                    routerlink as url, 
                    id_component,
                    activ,
                    (select icon from components where components.id =id_component) as icon, 
                    (select link from components where components.id =id_component) as url                     
                FROM menu_new 
                WHERE id = ${id}`;
            const { rows } = await this.pool.query(query);
            rows[0].children = await this.getMenu({ id: rows[0].key }); // 🔁 рекурсивный вызов                
            return rows[0];
        } catch (error) {
            this.logger.error(`❌ Ошибка получения меню (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Ошибка получения меню ${id}`);
        }
    }
    
    async add (params: { id: number, id_pers: number }): Promise<any> {
        
        const { id, id_pers } = params;
        const id_org = Number(this.configService.get<string>('ID_ORG')) ?? 0;

        if (!id || isNaN(Number(id))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
            const query = `
                INSERT INTO 
                    menu_new (
                        id, 
                        parent, 
                        name, 
                        id_site,
                        create_date,
                        create_user,
                        last_date,
                        last_user
                    ) 
                VALUES (
                    nextval('menu_new_id_seq'),
                    ${id},
                    'Новий',
                    ${id_org},
                    now(),
                    ${id_pers},
                    NOW(),
                    ${id_pers}                    
                )`;                 
            const ret = await this.pool.query(query);  
            return ret;
        } catch (error) {
            this.logger.error(`❌ Помилка видалення меню (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка видалення меню ${id}`);
        }
    }

    async del (params: { id: number, id_pers: number }): Promise<any> {
        
        const { id, id_pers } = params;
        
        if (!id || isNaN(Number(id))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }

        try {
            // ✅ Получаем все активные элементы, у которых parent = id
            const query = `
                UPDATE 
                    menu_new 
                SET 
                    parent=15, 
                    activ='f',
                    last_date = now(),
                    last_user = ${id_pers} 
                WHERE id=${id}`;                 
            const ret = await this.pool.query(query);  
            return ret;
        } catch (error) {
            this.logger.error(`❌ Помилка видалення меню (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка видалення меню ${id}`);
        }
    }

    async drop (params: { id: number, parent: number, id_pers: number }): Promise<any> {
        
        const { id, id_pers } = params;
        
        if (!id || isNaN(Number(id))) {
            throw new BadRequestException('Параметр "id" обязателен и должен быть числом');
        }
        if (!parent || isNaN(Number(parent))) {
            throw new BadRequestException('Параметр "parent" обязателен и должен быть числом');
        }
        try {
            // ✅ Получаем все активные элементы, у которых parent = id
            const query = `
                UPDATE parent=$2
                    menu_new 
                SET 
                    parent=$2,
                    last_date = now(),
                    last_user = ${id_pers}                      
                WHERE id=$1`;                 
            const ret = await this.pool.query(query,[id,parent]);  
            return ret;
        } catch (error) {
            this.logger.error(`❌ Помилка переміщення меню (id=${id}): ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка видалення меню ${id}`);
        }
    }
}
