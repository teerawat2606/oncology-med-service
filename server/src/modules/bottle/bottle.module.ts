import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bottle } from 'src/entities/bottle.entity';
import { BottleController } from './bottle.controller';
import { BottleRepository } from './bottle.repository';
import { BottleService } from './bottle.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bottle])],
  providers: [BottleService, BottleRepository],
  controllers: [BottleController],
  exports: [BottleService],
})
export class BottleModule {}
