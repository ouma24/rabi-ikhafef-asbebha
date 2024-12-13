import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { MailService } from 'src/services/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';
import { RefreshToken } from './schemas/refresh-token.schema';
import { ResetToken } from './schemas/reset-token.schema';
import { User } from './schemas/user.schema';
import { EditProfile } from './dtos/edit-profil.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name)
    private ResetTokenModel: Model<ResetToken>,
    private jwtService: JwtService,
    private mailService: MailService,
  
  ) {}

  async signup(signupData: SignupDto) {
    console.log("SIGNUP");
    
    //Check if email is in use
    const emailInUse = await this.UserModel.findOne({
      email: signupData.email,
    });
    if (emailInUse) {
      throw new BadRequestException('Email already in use');
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(signupData.password, 10);

    // Create user document and save in mongodb
    return await this.UserModel.create({
      ...signupData,
      password: hashedPassword,
    });
  }

  async login(credentials: LoginDto) {
    console.log("LOGINN");
    
    const { username, password } = credentials;
    //Find if user exists by email
    const user = await this.UserModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Wrong credentials, username not found ');
    }

    //Compare entered password with existing password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    //Generate JWT tokens
    const tokens = await this.generateUserTokens(user._id);
    return {
      ...tokens,
      userId: user._id,
    };
  }

  async changePassword(userId, oldpass: string, newpass: string) {
    // Trouver l'utilisateur
    console.log("------------------" ,userId);
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found...');
    }
  
    // Comparer l'ancien mot de passe avec celui dans la base de données
    const passwordMatch = await bcrypt.compare(oldpass, user.password);
    if (!passwordMatch) {
     // throw new UnauthorizedException('Wrong credentials');
     return  { "old":oldpass, "password":  passwordMatch};
    }
  
    // Mettre à jour le mot de passe
    const newHashedPassword = await bcrypt.hash(newpass, 10);
    user.password = newHashedPassword;
    await user.save();
  
    // Retourner une confirmation de succès
    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email_FP: string) {
    //Check that user exists
    const user = await this.UserModel.findOne({ email:email_FP });

    if (user) {
      //If user exists, generate password reset link
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const khikhou = Math.floor(100000 + Math.random() * 900000);

      const resetToken = nanoid(64);
      await this.ResetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate,
      });
      //Send the link to the user by email
      await this.mailService.sendPasswordResetEmail(email_FP, String(khikhou));

      return  khikhou 
    }

    return { message: 'If this user exists, they will receive an email', "yy":user };
  }

  async resetPassword(newPasss: string, resetToken: string) {
    //Find a valid reset token document
    const token = await this.ResetTokenModel.findOneAndDelete({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }

    //Change user password (MAKE SURE TO HASH!!)
    const user = await this.UserModel.findById(token.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }

    user.password = await bcrypt.hash(newPasss, 10);
    await user.save();
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Refresh Token is invalid');
    }
    return this.generateUserTokens(token.userId);
  }

  async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '10h' });
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId: string) {
    // Calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.RefreshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate, token } },
      {
        upsert: true,
      },
    );
  }

  async updateUser(id: string, updateProfileDto: EditProfile): Promise<User> {
    return this.UserModel.findByIdAndUpdate(id, updateProfileDto, { new: true });
  }
  

}
