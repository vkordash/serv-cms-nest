import { ApiProperty } from "@nestjs/swagger";

export class ComponentDto {
    @ApiProperty({example:'2',description:'Ідентифікатор компонента'})
    readonly id: number;
    @ApiProperty({example:'Список сторінок',description:'Назва компонента'})
    readonly name: string;   
}
