import {
  Table, Column, Model, DataType,
  BelongsTo, ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Ad } from './ad.model';

@Table({ tableName: 'favourites', timestamps: true, updatedAt: false, underscored: true })
export class Favourite extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Ad)
  @Column({ type: DataType.INTEGER, field: 'ad_id' })
  adId: number;

  @BelongsTo(() => Ad)
  ad: Ad;
}
