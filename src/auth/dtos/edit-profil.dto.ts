import { PartialType } from "@nestjs/mapped-types";
import { SignupDto } from "./signup.dto";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class EditProfile  {
    @IsString()
    @IsOptional()
    firstname: string;
  
    @IsString()
    @IsOptional()
    lastname: string;
  
    @IsString()
    @IsOptional()
    username: string;
  
    @IsEmail()
    @IsOptional()
    email: string;
}