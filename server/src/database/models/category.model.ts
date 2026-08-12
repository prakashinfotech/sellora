import {
  Table, Column, Model, DataType,
  HasMany, BelongsTo, ForeignKey,
} from 'sequelize-typescript';
import { Ad } from './ad.model';

@Table({ tableName: 'categories', timestamps: false })
export class Category extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  slug: string;

  @Column({ type: DataType.STRING })
  icon: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, field: 'parent_id' })
  parentId: number;

  @BelongsTo(() => Category, 'parentId')
  parent: Category;

  @HasMany(() => Category, 'parentId')
  subcategories: Category[];

  @HasMany(() => Ad)
  ads: Ad[];
}
