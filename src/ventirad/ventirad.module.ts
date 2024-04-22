import { Module } from '@nestjs/common';
import { VentiradService } from './ventirad.service';
import { VentiradController } from './ventirad.controller';

@Module({
  controllers: [VentiradController],
  providers: [VentiradService],
})
export class VentiradModule {}
