import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from '../database/models/payment.model';
import { Ad } from '../database/models/ad.model';

@Module({
  imports: [SequelizeModule.forFeature([Payment, Ad])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
