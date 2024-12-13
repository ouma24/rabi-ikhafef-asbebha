import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email_FP: string;
}
