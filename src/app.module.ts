import { Module, Res } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from './auth/auth.module';
import { TestController } from './test/test.controller';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { MenuModule } from './menu/menu.module';
import { PublicModule } from './public/public.module';
import { OrdersModule } from './orders/orders.module';
import { DatabaseModule } from './database/database.module';
import { SearchModule } from './search/search.module';
import { CartModule } from './cart/cart.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(),
    AuthModule,
    RestaurantsModule,
    UsersModule,
    MenuModule,
    PublicModule,
    OrdersModule,
    DatabaseModule,
    SearchModule,
    CartModule,
    NotificationsModule,
  ],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}