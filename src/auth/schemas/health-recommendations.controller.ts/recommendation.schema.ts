import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Recommendation extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  recommendation: string;

  @Prop()
  image: string; // Store image URLs if applicable
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);
