import { ApiProperty } from "@nestjs/swagger";

export class EmployeeDto {
    @ApiProperty({example:'425418',description:'Ідентифікатор сторінки'})
    readonly id: number;
    @ApiProperty({example:'Про відзначення річниці',description:'Заголововк'})
    readonly head: string;  
    @ApiProperty({example:'Річниця',description:'Титульний текст'})
    readonly title: string; 
    @ApiProperty({example:'Сьогодні ми відзначаємо ....',description:'Тест сторінки '})
    readonly text: string; 
    @ApiProperty({example:'2021-03-30T09:02:40.400Z',description:'Статус активний, не активний'})
    readonly date: string; 
    @ApiProperty({example:'34085',description:'Ідентифіктор пункту меню'})
    readonly id_component: number;  
} 