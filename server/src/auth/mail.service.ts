import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('SMTP_HOST', 'smtp.gmail.com'),
      port: config.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: config.get('SMTP_USER'),
        pass: config.get('SMTP_PASS'),
      },
    });
  }

  async sendOtp(to: string, otp: string) {
    const from = this.config.get('SMTP_FROM', 'Sellora <no-reply@sellora.com>');
    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'Your Sellora password reset OTP',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
            <h2 style="color:#4F46E5">Reset your password</h2>
            <p>Use the OTP below to reset your Sellora password. It expires in <strong>15 minutes</strong>.</p>
            <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#4F46E5;padding:16px 0">
              ${otp}
            </div>
            <p style="color:#888;font-size:13px">If you did not request this, ignore this email.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('[MailService] SMTP error:', err);
      throw new InternalServerErrorException('Failed to send OTP email');
    }
  }
}
