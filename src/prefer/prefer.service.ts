import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenantPoolService } from 'src/tenant-pool/tenant-pool.service';


@Injectable()
export class PreferService {

    private readonly logger = new Logger(PreferService.name);
    private Prefer:any = {};

    constructor(
        private poolService: TenantPoolService,
        private configService: ConfigService
    ) {}

    async getDataOrg(params: { name: string, db: string }): Promise<any> {

        const { name, db } = params;
        
        const pool = this.poolService.getPool(db);
        
        try {
            const query = `
                SELECT name, val
                FROM prefer_new 
                WHERE  id =1 and name='${name}')`;
            const { rows } = await pool.query(query);
            return  rows[0]['val'];
        } catch (error) {
            this.logger.error(`❌ Помилка отримання налаштувань : ${name}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання налаштувань : ${name}`);
        }              
    }

    async updatePrefOrg(params: {
            id_pers: number, 
            db : string,
            id_org : number,
            name: string, 
            val:string 
        }): Promise<any> {

        const { id_pers,db, id_org, name, val} = params;
        
        const pool = this.poolService.getPool(db);

        try {
            
            let _val: any;

            const arrBoolean = [
                'Tree_ShowAll',
                'Tree_ShowTyp7',
                'Page_Top', 
                'Page_SocNet', 
                'Page_RSS',
                'Editor_toolbox'
            ];
            const arrNumber = ['Page_Vlen' ];
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

            const query_sel = `
                SELECT 
                    count(*) as cnt 
                FROM prefer_new
                WHERE 
                    is_org=$1 AND
                    AND id_pers=0
                    AND db = $2
                    AND name = $3
                `;
            
            const res_sel = await pool.query(query_sel,[id_org,db,name]);
            if (res_sel.rowCount == 0) {
                const query = `
                INSERT INTO prefer_new
                    (
	                    id, 
                        id_org, 
                        id_pers, 
                        db,
                        name,
                        val
                    )
	            VALUES
                    (
                        nextval('prefer_new_id_seq'),
                        $1, 
                        $2, 
                        $3, 
                        $4, 
                        $5
                    );                
                `;
                const res =  await pool.query(query, [id_org, 0, db, name, _val ]);           
                return res.rowCount;
            }
            else {
                const query = `
                UPDATE prefer_new
                SET val = $1                    
                WHERE 
                    id_org=$2 AND
                    AND id_pers=$3
                    AND db = $4
                    AND name = $5
                `;
                const res =  await pool.query(query, [_val, id_org, 0, db, name ]);           
                return res.rowCount;
            }             
        } catch (error) {
            this.logger.error(`❌ Помилка отримання налаштувань : ${name}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання налаштувань : ${name}`);
        }              
    }

    async getUserPref(params: {id_pers: number, name?: string, db: string }): Promise<any> {

        const { id_pers, name, db } = params;
        
        const pool = this.poolService.getPool(db);

        try {
            
            const query = (name) 
            ? `SELECT
                name, val 
            FROM prefer_new
            WHERE id_pers=$1 AND name = $2`
            : `SELECT
               name, val 
            FROM prefer_new
            WHERE id_pers=$1`;

            const _arg = (name)
                ? [id_pers,name]
                : [id_pers];

            const { rows } = await pool.query(query,_arg);

            return rows.reduce<Record<string, string>>((acc, item) => {
                if (item.val == 'true') {
                    acc[item.name] = true;
                }
                else if (item.val == 'false') {
                    acc[item.name] = false;
                }
                else acc[item.name] = item.val;
                return acc;
            }, {});            
        } catch (error) {
            this.logger.error(`❌ Помилка отримання налаштувань : ${name}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання налаштувань : ${name}`);
        }              
    }

    async updatePrefUser(params: {
            id_pers: number, 
            db : string,
            id_org : number,
            name: string, 
            val:string            
        }): Promise<any> {

        const { id_pers, db, id_org, name, val } = params;
        
        const pool = this.poolService.getPool(db);

        try {
            
            console.log(params);
            let _val: any;

            const arrBoolean = [
                'Tree_ShowAll',
                'Tree_ShowTyp7',
                'Page_Top', 
                'Page_SocNet', 
                'Page_RSS',
                'Editor_toolbox'
            ];
            const arrNumber = ['Page_Vlen' ];
            const arrDate = ['date'];

            // Boolean параметры
           /* if (arrBoolean.includes(name)) {
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
            }*/

            const query_sel = `
                SELECT 
                    *
                FROM prefer_new
                WHERE 
                    id_org=$1
                    AND id_pers=$2
                    AND db = $3
                    AND name = $4
                `;
            const _arg_sel = [id_org, id_pers ,db, name];
            //console.log(query_sel);
            //console.log(_arg_sel);
            const res_sel = await pool.query(query_sel,_arg_sel);
            //console.log(res_sel.rowCount);
            //console.log(val);
            if (res_sel.rowCount == 0) {
                const query = `
                INSERT INTO prefer_new
                    (
	                    id, 
                        id_org, 
                        id_pers, 
                        db, 
                        name,
                        val,
                        create_user,
                        create_date,
                        last_user,
                        last_date
                    )
	            VALUES
                    (
                        nextval('prefer_new_id_seq'),
                        $1, 
                        $2, 
                        $3, 
                        $4, 
                        $5,
                        $6,
                        'now()',
                        $7,
                        'now()'
                    );                
                `;
                //console.log(query);
                const _arg_ins = [id_org, id_pers, db, name, val, id_pers, id_pers ];
                const res =  await pool.query(query,_arg_ins );           
                return res.rowCount;
            }
            else {
                const query = `
                UPDATE prefer_new
                SET 
                    val = $1,
                    last_user = $3,
                    last_date = 'now()'                    
                WHERE 
                    id_org=$2 
                    AND id_pers=$3
                    AND db = $4
                    AND name = $5
                `;
                const _arg_upd = [val, id_org, id_pers, db, name ];
                console.log(query);
                console.log(_arg_upd);
                const res =  await pool.query(query, _arg_upd);           
                console.log(query);
                return res.rowCount;
            } 
        } catch (error) {
            this.logger.error(`❌ Помилка отримання налаштувань : ${name}: ${error.message}`, error.stack);
            throw new InternalServerErrorException(`Помилка отримання налаштувань : ${name}`);
        }              
    }
}
