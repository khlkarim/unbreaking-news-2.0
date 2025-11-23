import { ApiProperty } from '@nestjs/swagger';

export class EvaluationResponseDto {
  athenticityScore: number;
  notes: string[];
}