import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateRecommendationDto, HealthRecommendationDto } from 'src/auth/dtos/dto/create-recommendation.dto';
import { Recommendation } from './recommendation.schema';
import { RecommendationService } from 'src/services/health.recommendations.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get()
  async getRecommendations(): Promise<Recommendation[]> {
    return this.recommendationService.getAllRecommendations();
  }

  @Post()
  async createRecommendation(
    @Body() createRecommendationDto: CreateRecommendationDto,
  ): Promise<Recommendation> {
    return this.recommendationService.createRecommendation(createRecommendationDto);
  }
}
