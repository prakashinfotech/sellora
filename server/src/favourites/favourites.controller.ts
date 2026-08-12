import { Controller, Get, Post, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FavouritesService } from './favourites.service';

@ApiTags('favourites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favourites')
export class FavouritesController {
  constructor(private favouritesService: FavouritesService) {}

  @Get()
  findAll(@CurrentUser() user: { id: number }) {
    return this.favouritesService.findByUser(user.id);
  }

  @Post(':adId/toggle')
  toggle(
    @CurrentUser() user: { id: number },
    @Param('adId', ParseIntPipe) adId: number,
  ) {
    return this.favouritesService.toggle(user.id, adId);
  }
}
