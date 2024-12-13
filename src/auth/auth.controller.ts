import { Body, Controller, Get, Param, Post, Put  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignupDto } from './dtos/signup.dto';
import { EditProfile } from './dtos/edit-profil.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signupData: SignupDto) {
    return this.authService.signup(signupData);
  }
  @Get()
  async getK(): Promise<number> {
    return 22
  }
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }


  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    //@Req() req,
  ) {
    console.log("------------------");
    return this.authService.changePassword(
      changePasswordDto.userId,
      changePasswordDto.oldpass,
      changePasswordDto.newpass,
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email_FP);
  }

  @Put('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(
      resetPasswordDto.newpass,
      resetPasswordDto.resetToken,
    );
  }

/*
   @Put(':id')
  // 
   async updateProfile(
     //@Param('id') id: string,
     @Body() updateProfileDto: EditProfile,
  //   
   ) {
  //
  //   
  //
  //   // Appelle le service pour mettre à jour le profil dans la base de données
    /* const updatedUser = await this.authService.updateUser(
      //id,
       updateProfileDto);
  //
     return {
       message: 'Profile updated successfully',
       data: updatedUser,
     };
   }
}
function Param(arg0: string): (target: AuthController, propertyKey: "updateProfile", parameterIndex: 0) => void {
  throw new Error('Function not implemented.');
}

*/

@Put(':id')
async updateProfile(
  @Param('id') id: string, // Assurez-vous que `Param` est importé
  @Body() updateProfileDto: EditProfile,
) {
  const updatedUser = await this.authService.updateUser(id, updateProfileDto);
  return {
    message: 'Profile updated successfully',
    data: updatedUser,
  };
}

}

/*function Get(arg0: string): (target: AuthController, propertyKey: "signUp", descriptor: TypedPropertyDescriptor<(signupData: SignupDto) => Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & Required<...>>>) => void | TypedPropertyDescriptor<...> {
  throw new Error('Function not implemented.');
}*/
