import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Order, OrderItem]),
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}