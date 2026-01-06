import { IsArray, IsInt, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  menuItemId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsArray()
  items!: CreateOrderItemDto[];
}