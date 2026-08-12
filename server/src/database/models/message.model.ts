import {
  Table, Column, Model, DataType,
  BelongsTo, ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Ad } from './ad.model';

@Table({ tableName: 'messages', timestamps: true, updatedAt: false, underscored: true })
export class Message extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, field: 'sender_id' })
  senderId: number;

  @BelongsTo(() => User, 'senderId')
  sender: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, field: 'receiver_id' })
  receiverId: number;

  @BelongsTo(() => User, 'receiverId')
  receiver: User;

  @ForeignKey(() => Ad)
  @Column({ type: DataType.INTEGER, field: 'ad_id' })
  adId: number;

  @BelongsTo(() => Ad)
  ad: Ad;

  @Column({ type: DataType.TEXT, allowNull: false })
  body: string;
}
