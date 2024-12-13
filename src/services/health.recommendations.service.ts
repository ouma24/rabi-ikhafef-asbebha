import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Recommendation } from 'src/auth/schemas/health-recommendations.controller.ts/recommendation.schema';
import { CreateRecommendationDto } from 'src/auth/dtos/dto/create-recommendation.dto'; 
import { Model } from 'mongoose';

//import { RecommendationShema} from './recommendation.schema';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel(Recommendation.name)
    private readonly recommendationModel: Model<Recommendation>,
  ) {}

  async getAllRecommendations(): Promise<Recommendation[]> {
    console.log("gfhfghfhgfghf");
    return this.recommendationModel.find().exec();
  }

  async createRecommendation(
    createRecommendationDto: CreateRecommendationDto,
  ): Promise<Recommendation> {
    const newRecommendation = new this.recommendationModel(createRecommendationDto);
    return newRecommendation.save();
  }
}
