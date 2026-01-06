import { IsInt } from 'class-validator';

export class AssignDeliveryDto {
  @IsInt()
  deliveryStaffId!: number;
}