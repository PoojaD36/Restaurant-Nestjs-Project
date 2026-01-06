import { IsInt, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name!: string;

  @IsInt()
  ownerId!: number; // user with RESTAURANT role
}