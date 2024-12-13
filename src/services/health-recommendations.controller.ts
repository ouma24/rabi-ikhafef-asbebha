import { Controller, Get, Post, Body } from '@nestjs/common';
import { RecommendationService } from './health.recommendations.service';
import { Recommendation } from 'src/auth/schemas/health-recommendations.controller.ts/recommendation.schema';  
import { CreateRecommendationDto, HealthRecommendationDto} from 'src/auth/dtos/dto/create-recommendation.dto';
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  // Endpoint to get all recommendations
  @Get()
  async getRecommendations(): Promise<Recommendation[]> {
    console.log("---------------------------")
    return this.recommendationService.getAllRecommendations();
  }
  @Post()
  async createRecommendation(@Body() dto: CreateRecommendationDto) {
    return this.recommendationService.createRecommendation(dto);
  }

}
