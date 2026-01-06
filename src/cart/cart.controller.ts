import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartPreviewDto } from './dto/cart-preview.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from 'src/common/enums/guards/roles.guard';
import { Roles } from 'src/common/enums/decorators/roles.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('preview')
  preview(@Body() dto: CartPreviewDto) {
    return this.cartService.previewCart(dto);
  }
}