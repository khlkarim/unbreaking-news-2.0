import { ApiProperty } from '@nestjs/swagger';

export class EvaluationResponseDto {
  metadata: {
    score: number;
    notes: string[];
  };
  contentIntegrity: {
    score: number;
    notes: string[];
  };
  visualForensics: {
    score: number;
    notes: string[];
  };
  consistency: {
    score: number;
    notes: string[];
  };
}