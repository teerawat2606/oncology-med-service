import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drug } from 'src/entities/drug.entity';
import { DrugController } from './drug.controller';
import { DrugRepository } from './drug.repository';
import { DrugService } from './drug.service';

@Module({
  imports: [TypeOrmModule.forFeature([Drug])],
  controllers: [DrugController],
  providers: [DrugService, DrugRepository],
  exports: [DrugService],
})
export class DrugModule {}
