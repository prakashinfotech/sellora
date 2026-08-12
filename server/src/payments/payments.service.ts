import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { Payment } from '../database/models/payment.model';
import { Ad } from '../database/models/ad.model';

export const PLANS: Record<string, { days: number; amount: number; label: string }> = {
  '7days':  { days: 7,  amount: 9900,  label: '7 Days Boost'  },
  '30days': { days: 30, amount: 19900, label: '30 Days Boost' },
};

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(
    @InjectModel(Payment) private paymentModel: typeof Payment,
    @InjectModel(Ad)      private adModel:      typeof Ad,
    private config: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id:     config.get('RAZORPAY_KEY_ID',     ''),
      key_secret: config.get('RAZORPAY_KEY_SECRET', ''),
    });
  }

  async createOrder(userId: number, adId: number, plan: string) {
    const planConfig = PLANS[plan];
    if (!planConfig) throw new BadRequestException('Invalid plan');

    const ad = await this.adModel.findByPk(adId);
    if (!ad) throw new NotFoundException('Ad not found');
    if (ad.userId !== userId) throw new ForbiddenException();

    const order = await this.razorpay.orders.create({
      amount:   planConfig.amount,
      currency: 'INR',
      receipt:  `ad_${adId}_${Date.now()}`,
    });

    await this.paymentModel.create({
      userId,
      adId,
      razorpayOrderId: order.id,
      amount: planConfig.amount,
      plan,
      status: 'created',
    });

    return {
      orderId:  order.id,
      amount:   planConfig.amount,
      currency: 'INR',
      keyId:    this.config.get('RAZORPAY_KEY_ID', ''),
    };
  }

  async verifyAndActivate(
    userId: number,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ) {
    const secret = this.config.get('RAZORPAY_KEY_SECRET', '');
    const body   = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (expectedSig !== razorpaySignature) {
      throw new BadRequestException('Payment verification failed');
    }

    const payment = await this.paymentModel.findOne({ where: { razorpayOrderId } });
    if (!payment) throw new NotFoundException('Order not found');
    if (payment.userId !== userId) throw new ForbiddenException();

    const planConfig = PLANS[payment.plan];
    const featuredUntil = new Date();
    featuredUntil.setDate(featuredUntil.getDate() + planConfig.days);

    await payment.update({ razorpayPaymentId, status: 'paid' });
    await this.adModel.update({ featuredUntil }, { where: { id: payment.adId } });

    return { success: true, featuredUntil, plan: payment.plan };
  }
}
