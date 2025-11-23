import { ApiProperty } from '@nestjs/swagger';

export class EvaluationRequestDto {
  @ApiProperty()
  message: string;

  file: Express.Multer.File;
}