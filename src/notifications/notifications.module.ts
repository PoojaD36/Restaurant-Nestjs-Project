import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './notification.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Notification])],
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsGateway],
  controllers: [NotificationsController],
})
export class NotificationsModule {}