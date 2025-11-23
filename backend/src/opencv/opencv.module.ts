import { Module } from '@nestjs/common';
import { OpencvService } from './opencv.service';
import { OpencvController } from './opencv.controller';

@Module({
  controllers: [OpencvController],
  providers: [OpencvService],
})
export class OpencvModule {}
