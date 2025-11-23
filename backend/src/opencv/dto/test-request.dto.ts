import { ApiProperty } from '@nestjs/swagger';

export class TestRequestDto {
  @ApiProperty()
  message: string;
}