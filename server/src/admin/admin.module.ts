import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../database/models/user.model';
import { Ad } from '../database/models/ad.model';
import { Category } from '../database/models/category.model';
import { Payment } from '../database/models/payment.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Ad, Category, Payment])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
