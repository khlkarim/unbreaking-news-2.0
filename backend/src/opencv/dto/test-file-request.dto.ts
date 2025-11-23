import { ApiProperty } from '@nestjs/swagger';

export class TestFileRequestDto {
  @ApiProperty()
  formData: Express.Multer.File;
}