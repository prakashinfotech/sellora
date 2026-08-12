import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { Ad } from '../database/models/ad.model';
import { User } from '../database/models/user.model';
import { Category } from '../database/models/category.model';

@Module({
  imports: [SequelizeModule.forFeature([Ad, User, Category])],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}
