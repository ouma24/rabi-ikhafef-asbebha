import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Recommendation } from 'src/auth/schemas/health-recommendations.controller.ts/recommendation.schema';
import { RecommendationSchema } from 'src/auth/schemas/health-recommendations.controller.ts/recommendation.schema';
import { RecommendationService } from './health.recommendations.service';
import { RecommendationController } from './health-recommendations.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recommendation.name, schema: RecommendationSchema },
    ]),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommendationModule {}
