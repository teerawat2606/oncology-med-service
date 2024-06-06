import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { TableName } from './enums';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('data/:tableName')
  getTable(
    @Param('tableName') tableName: TableName,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): any {
    try {
      // if limit is not provided, set it to -1 to return all data
      if (!limit) {
        limit = -1;
      }
      // if offset is not provided, set it to 0
      if (!offset) {
        offset = 0;
      }
      return this.appService.getTable(tableName, Number(offset), Number(limit));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
