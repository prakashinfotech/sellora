import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Ad } from './ad.model';

@Table({ tableName: 'payments', timestamps: true, underscored: true })
export class Payment extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Ad)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'ad_id' })
  adId: number;

  @BelongsTo(() => Ad)
  ad: Ad;

  @Column({ type: DataType.STRING, allowNull: false, field: 'razorpay_order_id' })
  razorpayOrderId: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'razorpay_payment_id' })
  razorpayPaymentId: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  amount: number;

  @Column({ type: DataType.STRING, allowNull: false })
  plan: string;

  @Column({ type: DataType.STRING, defaultValue: 'created' })
  status: string;
}
