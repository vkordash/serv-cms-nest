import { Inject, Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
//import { Pool } from 'pg';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { TenantPoolService } from 'src/tenant-pool/tenant-pool.service';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  private User:any = {};

  private execPromise = promisify(exec);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private poolService: TenantPoolService,
  ) {}

  async validateUser({ login, passwd, db }: AuthPayloadDto) {

     // 1. Проверка входных данных
    if (!db || !login || !passwd) {
      console.log('Данные для входа неполные');
      return null;
    }

    try {
        
      // Получаем пул именно для той базы, которая пришла в запросе (db)
      const pool = this.poolService.getPool(db);

        const query = `
          SELECT 
            id, 
            login, 
            password, 
            id_org, 
            id_pers, 
            admin, 
            (SELECT 
              (coname || ' ' || fname || ' ' || lname ) as name_user 
            FROM employee_new
            WHERE employee_new.id=users_new.id_pers ) as name_user
          FROM users_new 
          WHERE login='${login}' and activ=1 
          limit 1              
          `;
        console.log(query);
        const res = await pool.query(query);
        
        console.log(res.rows[0]);


        if (res.rowCount==1){
            const hash = await this.generateDovecotPassword(passwd);
            if (res.rows[0].password==hash) {
                //res.rows[0].orgName = 'orgName' ;// await getOrgName(db);
                //res.rows[0].person = 1384; //await getUserName(db,res.rows[0].id_pers);                
                //res.rows[0].url_site = 'https://menarada.gov.ua/'; //await getUrlSite(db);
                this.User =  {}; 
                this.User.db = db;  
                this.User.role = ["menu","page","video","photo"];
                this.User.id_org = res.rows[0].id_org;
                this.User.id_pers = res.rows[0].id_pers;
                
                /*switch (db) {
                  case 'mena_rada':
                      this.User.id_org=18717;
                      break;
                  case 'nos_rada':
                      this.User.id_org=2478;
                      break;
                  default:
                      res.status(200).json({ error: 'Помилка авторизації! База данних відсутня - Check DB! ', status: 0 });
                      return;
                }*/

                /*const retUser = {
                  "db":db,
                  "id_org":18717,
                  "role":["menu","page","video","photo"],
                  "id_pers":res.rows[0].id_pers,
                //  "login":res.rows[0].login              
                };*/

                console.log ('Auth ok');
                console.log(this.User);

                //const token = this.jwtService.sign(this.User);
                const token = this.jwtService.sign(this.User);
                //const token = this.jwtService.sign({ this.User }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                return {
                  token : token,
                  user_name : res.rows[0].name_user,
                  id_user : this.User.id_pers,
                  id_org : this.User.id_org,                  
                  status: 1        
                }
            }        
      }
      return null;
    } catch (error) {
      this.logger.error(`❌ Помилка авторизації! : ${error.message}`, error.stack);
      throw new InternalServerErrorException('Помилка авторизації! ');
    }
  }

  async  generateDovecotPassword(password, scheme = 'HMAC-MD5') {
      try {
          //const command = `dovecotpw -s ${scheme} -p ${password}`;
          const command = `doveadm pw -s ${scheme} -p ${password}`;
          

          const { stdout } = await this.execPromise(command);
          return stdout.trim();
      } catch (error) {
          throw new Error(`Ошибка выполнения: ${error.message}`);
      }
  } 
}
