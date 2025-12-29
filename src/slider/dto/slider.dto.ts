import { ApiProperty } from "@nestjs/swagger";

export class SliderDto {
    @ApiProperty({example:'26346',description:'Ідентифікатор пункту меню'})
    readonly key: number;
    @ApiProperty({example:'Новини',description:'Назва пункту меню'})
    readonly label: string;  
    @ApiProperty({example:'list-pages',description:'Маршрут'})
    readonly url: string; 
    @ApiProperty({example:'Список сторінок',description:'Ідентифікатор компоненту'})
    readonly id_component: string; 
    @ApiProperty({example:'true',description:'Статус активний, не активний'})
    readonly activ: boolean; 
    @ApiProperty({example:'pi pi-list',description:'Назва icon'})
    readonly icon: string;  
    @ApiProperty({example:'[]',description:'Массив вкладених пунктів меню типу MenuDTO'})
    readonly children: [];  
}