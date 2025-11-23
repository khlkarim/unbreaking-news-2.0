import { ApiProperty } from '@nestjs/swagger';

export class TestResponseDto {
  @ApiProperty()
  message: string;
}