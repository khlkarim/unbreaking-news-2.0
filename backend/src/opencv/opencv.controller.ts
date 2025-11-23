import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { OpencvService } from './opencv.service';
import { ApiTags } from '@nestjs/swagger';
import { TestRequestDto } from './dto/test-request.dto';
import { TestResponseDto } from './dto/test-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestFileRequestDto } from './dto/test-file-request.dto';
import { TestFileResponseDto } from './dto/test-file-response.dto';
import { Express } from 'express';
import { EvaluationRequestDto } from './dto/evaluation-request.dto';
import { EvaluationResponseDto } from './dto/evaluation-response.dto';
import { plainToClass } from 'class-transformer';

@ApiTags('Opencv')
@Controller({
  path: 'opencv',
  version: '1',
})
export class OpencvController {
  constructor(private readonly service: OpencvService) {}

  @Post('opencv/test')
  @HttpCode(HttpStatus.OK)
  public test(@Body() evalReq: TestRequestDto): Promise<TestResponseDto> {
    return this.service.test(evalReq);
  }

  @Post('opencv/test_opencv')
  @HttpCode(HttpStatus.OK)
  public testOpencv(@Body() evalReq: TestRequestDto): Promise<TestResponseDto> {
    return this.service.testOpencv(evalReq);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Post('evaluate')
  @UseInterceptors(FileInterceptor('file'))
  evaluate(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ): Promise<EvaluationResponseDto> {
    const evalReq = plainToClass(EvaluationRequestDto, { ...body, file});
    console.log(evalReq.file);
    return this.service.evaluate(evalReq);
  }
}
