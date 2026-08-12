import {
  Table, Column, Model, DataType,
  HasMany, BeforeCreate, BeforeUpdate,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Ad } from './ad.model';
import { Favourite } from './favourite.model';

@Table({ tableName: 'users', timestamps: true, underscored: true })
export class User extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'password_hash' })
  passwordHash: string;

  @Column({ type: DataType.STRING })
  city: string;

  @Column({ type: DataType.STRING })
  avatar: string;

  @Column({ type: DataType.STRING(6), allowNull: true, field: 'reset_otp' })
  resetOtp: string | null;

  @Column({ type: DataType.DATE, allowNull: true, field: 'reset_otp_expiry' })
  resetOtpExpiry: Date | null;

  @Column({ type: DataType.STRING, defaultValue: 'user' })
  role: string;

  @HasMany(() => Ad)
  ads: Ad[];

  @HasMany(() => Favourite)
  favourites: Favourite[];

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (user.changed('passwordHash')) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}
