import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import striptags from 'striptags';
import { ConfigService } from '@nestjs/config';
import { EditorDto } from './dto/editor.dto';
import { Pool } from 'pg';
import * as he from 'he';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class EditorService {

    private readonly logger = new Logger(EditorService.name);
 
    private async createSymlink(
            sourceFilePath: string,
            targetDir: string,
        ): Promise<string> {

        // Проверяем, что исходный файл существует
        await fs.access(sourceFilePath);

        // Имя файла (без пути)
        const fileName = path.basename(sourceFilePath);

        // Полный путь, где будет лежать симлинк
        const linkPath = path.join(targetDir, fileName);

        try {
            // Если симлинк уже существует — просто возвращаем путь
            await fs.lstat(linkPath);
            return linkPath;
        } catch {
            // симлинка нет — создаём
        }

        // Создаём каталог назначения, если его нет
        await fs.mkdir(targetDir, { recursive: true });

        // Создаём символическую ссылку
        await fs.symlink(sourceFilePath, linkPath);

        return linkPath;
    }

    constructor(
        @Inject('PG_CONNECTION') private readonly pool: Pool,
        private configService: ConfigService
    ) {}

    async save (params:any) : Promise<any> {
        //console.log(params.pageId);
        //console.log(params.text);
        // const res =await getPool(db).query("UPDATE pages_new set text=$1 where id=$2",[text,id]);  
        //console.log(res);      
        const { id_page, text, id_pers, id_menu, tp_page} = params;

        if (!id_page || isNaN(Number(id_page))) {
            throw new BadRequestException('Параметр "pageId" обязателен и должен быть числом');
        }

        try {
            
            const id_org = Number(this.configService.get<string>('ID_ORG')) ?? 0;

            const query = (id_page==0) ? 
                `
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
                        $1,
                        $2,
                        now(),
                        $3,
                        now(),
                        $4,
                        $5
                    ) 
                    RETURNING id, id_menu`
                : 
                `UPDATE 
                    pages_new 
                SET text=$2,
                    last_date = NOW(),
                    last_user = $3
                WHERE id=$1 
                RETURNING id, id_menu`;
            const _arg = (id_page==0) ? 
                [id_menu, text, id_pers, id_pers, id_org]
                : [id_page,text,id_pers]; 
            
            console.log(id_org);
            console.log(query);
            console.log(_arg);
            const { rows } = await this.pool.query(query,_arg);
            
            if (id_page==0) {
                const query_upload = `
                    UPDATE
                        upload_files
                    SET id_page = $1
                    WHERE 
                        id_page=0 and 
                        id_menu=$2 and 
                        create_user = $3
                `; 
                
                const  res  = await this.pool.query(query_upload,[rows.id, id_menu, id_pers]);
            }
            console.log(rows[0]);
            return rows;             
        }  catch (error) {
            this.logger.error(`❌ Помилка збереження редактора (id=${id_page}): ${error.message}`, error.stack);
            throw new InternalServerErrorException(`❌ Помилка збереження редактора (id=${id_page})`);
        }        
    }

    async getSubMenu (params: { id_menu: number, id_pers:number }): Promise<any> {
        
        const { id_menu, id_pers } = params;

        try {

            const query = `
                SELECT 
                    id, 
                    name, 
                    id_component,
                    (select icon from components where components.id =id_component) as icon, 
                    (select link from components where components.id =id_component) as url 
                FROM 
                    menu_new 
                WHERE 
                    parent=${id_menu} 
                    AND activ='t' 
                ORDER BY pn
            `;

            const res = await this.pool.query(query);
            if (res.rowCount == 0) {
                return {'ok':false,'data':''};
            }
            else {
                const data:string[] = [];
                data.push('<ul class="page-submenu">');           
                for (const item of res.rows) 
                {                         
                    const icon = item.icon ?? '';
                    if (icon=='')
                        data.push(`<li class="page-item-submenu"><a href='${item.url}?id=${item.id}&typ=${item.id_component}'>${item.name}</a></li>`);
                    else 
                        data.push(`<li class="page-item-submenu"><span class='icon-menu'>${icon}</span><a href='${item.url}?id=${item.id}&typ=${item.id_component}'>${item.name}</a></li>`);
                }  
                data.push('</ul>');
                return {'ok':true,'data':data.join('')}                
            }            
        }
        catch (err) {
            console.log(err.stack) 
        }
    }

    async Upload_Files (params:any) : Promise<any> {
        //console.log(params.pageId);
        //console.log(params.text);
        // const res =await getPool(db).query("UPDATE pages_new set text=$1 where id=$2",[text,id]);  
        //console.log(res);      
        const { id_page, id_menu, id_component, id_pers, path, srcDir} = params;

        const targetDir = srcDir.replace('web_docs', 'uploads');
        const lnk = await this.createSymlink(path, targetDir);

        try {
           
            const query = `
                INSERT INTO
                    upload_files (
                        id,
                        id_page,
                        id_menu,
                        src,
                        lnk,
                        create_date,
                        create_user                        
                        )
                    VALUES (
                        nextval('upload_files_id_seq'),
                        $1,
                        $2,
                        $3,
                        $4,
                        now(),
                        $5
                    ) 
                    RETURNING src, lnk
                `;
            const _arg = [id_page, id_menu, path, lnk, id_pers ];

            const { rows } = await this.pool.query(query,_arg);
            
            console.log(rows);
            return lnk;             
        }  catch (error) {
            this.logger.error(`❌ Помилка збереження редактора (id=${id_page}): ${error.message}`, error.stack);
            throw new InternalServerErrorException(`❌ Помилка збереження редактора (id=${id_page})`);
        }   
    }
}
