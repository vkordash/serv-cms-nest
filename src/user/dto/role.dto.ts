import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({example:'Новини',description:'Назва пункту меню'})
    readonly db: string;  
    @ApiProperty({example:'26346',description:'Ідентифікатор пункту меню'})
    readonly id_org: number;
    @ApiProperty({example:'Новини',description:'Назва пункту меню'})
    readonly role: string;  
    @ApiProperty({example:'list-pages',description:'Маршрут'})
    readonly id_pers: number; 
    @ApiProperty({example:'true',description:'Статус активний, не активний'})
    readonly login: string;     
}