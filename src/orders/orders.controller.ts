import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/enums/guards/roles.guard';
import { Roles } from 'src/common/enums/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AssignDeliveryDto } from './dto/assign-delivery.dto';
import { OrderStatus } from 'src/common/enums/order-status.enum';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.userId, dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT, UserRole.DELIVERY)
  updateStatus(
    @Param('id') id: number,
    @Body() dto: UpdateOrderStatusDto,
    @Req() req,
  ) {
    return this.ordersService.updateOrderStatus(
      Number(id),
      dto.status,
      req.user,
    );
  }

  @Patch(':id/assign-delivery')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  assignDelivery(
    @Param('id') id: number,
    @Body() dto: AssignDeliveryDto,
    @Req() req,
  ) {
    return this.ordersService.assignDeliveryStaff(
      Number(id),
      dto.deliveryStaffId,
      req.user,
    );
  }

  @Get()
  async getOrdersList(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.getOrdersList(
      req.user,
      Number(page),
      Number(limit),
      status,
    );
  }
}
