import {
  Table, Column, Model, DataType,
  BelongsTo, ForeignKey, HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Category } from './category.model';
import { Favourite } from './favourite.model';

export enum AdStatus {
  ACTIVE = 'active',
  SOLD = 'sold',
  INACTIVE = 'inactive',
}

@Table({ tableName: 'ads', timestamps: true, underscored: true })
export class Ad extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  price: number;

  @Column({ type: DataType.JSONB, defaultValue: [] })
  images: string[];

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, field: 'category_id' })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({ type: DataType.STRING })
  city: string;

  @Column({ type: DataType.STRING })
  state: string;

  @Column({ type: DataType.FLOAT })
  lat: number;

  @Column({ type: DataType.FLOAT })
  lng: number;

  @Column({
    type: DataType.ENUM(...Object.values(AdStatus)),
    defaultValue: AdStatus.ACTIVE,
  })
  status: AdStatus;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  views: number;

  @Column({ type: DataType.DATE, allowNull: true, field: 'featured_until' })
  featuredUntil: Date;

  @HasMany(() => Favourite)
  favourites: Favourite[];
}
