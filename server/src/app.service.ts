import { Injectable } from '@nestjs/common';
import { TableName } from './enums';
import { UserService } from './modules/user/user.service';
import { CycleService } from './modules/cycle/cycle.service';
import { BottleService } from './modules/bottle/bottle.service';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly cycleService: CycleService,
    private readonly bottleService: BottleService,
  ) {}
  getTable(tableName: TableName, offset: number, limit: number): Promise<any> {
    switch (tableName) {
      case TableName.USER:
        return this.userService.findAll(offset, limit);
      case TableName.CYCLE:
        return this.cycleService.findAll(offset, limit);
      case TableName.BOTTLE:
        return this.bottleService.findAll(offset, limit);
      default:
        throw new Error(
          `Invalid table name ${tableName}. The table name must be one of ${Object.values(
            TableName,
          )}`,
        );
    }
  }
}
