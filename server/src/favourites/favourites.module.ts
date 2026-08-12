import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FavouritesController } from './favourites.controller';
import { FavouritesService } from './favourites.service';
import { Favourite } from '../database/models/favourite.model';
import { Ad } from '../database/models/ad.model';

@Module({
  imports: [SequelizeModule.forFeature([Favourite, Ad])],
  controllers: [FavouritesController],
  providers: [FavouritesService],
})
export class FavouritesModule {}
