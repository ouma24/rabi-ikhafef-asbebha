import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class HealthRecommendationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  recommendation: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;
}
