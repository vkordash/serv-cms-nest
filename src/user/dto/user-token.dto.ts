import { ApiProperty } from "@nestjs/swagger";

export class UserTokenDto {
    @ApiProperty({example:'Новини',description:'Назва бази данних'})
    readonly db: string;  
    @ApiProperty({example:'26346',description:'Ідентифікатор організації'})
    readonly id_org: number;
    @ApiProperty({example:'Новини',description:'Обєкт ролей'})
    readonly role:string []; 
    @ApiProperty({example:'list-pages',description:'Маршрут'})
    readonly id_pers: number; 
    @ApiProperty({example:'true',description:'Статус активний, не активний'})
    readonly login: string;     
}


