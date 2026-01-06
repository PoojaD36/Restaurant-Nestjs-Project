import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('restaurants')
  listRestaurants() {
    return this.publicService.listRestaurants();
  }

  @Get('restaurants/:id/menu')
  getMenu(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.publicService.getMenuByRestaurant(id);
  }
}