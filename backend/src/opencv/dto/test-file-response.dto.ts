import { ApiProperty } from '@nestjs/swagger';

export class TestFileResponseDto {
  @ApiProperty()
  message: string;
}