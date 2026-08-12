import {
  Injectable, UnauthorizedException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/models/user.model';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      passwordHash: dto.password,
      phone: dto.phone,
      city: dto.city,
    } as any);

    return this.buildTokenResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await user.validatePassword(dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.buildTokenResponse(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ where: { email: dto.email } });
    // Always return success to avoid email enumeration
    if (!user) return { message: 'If that email is registered, an OTP has been sent.' };

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await user.update({ resetOtp: otp, resetOtpExpiry: expiry });
    await this.mailService.sendOtp(user.email, otp);

    return { message: 'If that email is registered, an OTP has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({ where: { email: dto.email } });
    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (user.resetOtp !== dto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (new Date() > user.resetOtpExpiry) {
      throw new BadRequestException('OTP has expired, please request a new one');
    }

    await user.update({
      passwordHash: dto.newPassword,
      resetOtp: null,
      resetOtpExpiry: null,
    });

    return { message: 'Password reset successfully' };
  }

  private buildTokenResponse(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }
}
