// mail.service.ts
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,  // Mets "true" pour SSL/TLS sur le port 465
      auth: {
        user: 'yesser.khaloui@etudiant-fst.utm.tn',
        pass: 'wgsynqjoiolzvwzt',
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    //const resetLink = ${token};
    const mailOptions = {
      from: 'Auth-backend service',
      to: to,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><p>${token}</p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
