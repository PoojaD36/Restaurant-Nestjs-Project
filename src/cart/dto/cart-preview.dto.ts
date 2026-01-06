import { IsArray, IsInt, Min } from 'class-validator';

export class CartItemDto {
  @IsInt()
  menuItemId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CartPreviewDto {
  @IsArray()
  items!: CartItemDto[];
}