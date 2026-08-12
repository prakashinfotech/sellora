import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaymentsService, PLANS } from './payments.service';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('plans')
  getPlans() {
    return PLANS;
  }

  @Post('create-order')
  createOrder(
    @CurrentUser() user: { id: number },
    @Body() body: { adId: number; plan: string },
  ) {
    return this.paymentsService.createOrder(user.id, body.adId, body.plan);
  }

  @Post('verify')
  verify(
    @CurrentUser() user: { id: number },
    @Body() body: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    },
  ) {
    return this.paymentsService.verifyAndActivate(
      user.id,
      body.razorpayOrderId,
      body.razorpayPaymentId,
      body.razorpaySignature,
    );
  }
}
