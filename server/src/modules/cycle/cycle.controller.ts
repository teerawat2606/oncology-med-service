import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Cycle } from 'src/entities/cycle.entity';
import { CycleStatus, TaskType } from 'src/enums';
import { UserInfo } from '../user/user.dto';
import {
  AppointmentCycleDto,
  AppointmentDto,
  CheckCycleDto,
  CostSummaryDto,
  CreateCycleDto,
  CycleByDateDto,
  DetailedCycleDto,
  DrugSummaryDto,
  InventoryCycleDto,
  OpenCycleDto,
  PharmacyCycleDto,
  ReScheduleCycleDto,
  ReadyCycleDto,
  ReturnBottlesDto,
  ReturnCycleDto,
  ShortCycleDto,
  UpdateAppointmentCycleDto,
  UpdateCheckCycleDto,
  UpdateInventoryCycleDto,
  UpdateOpenCycleDto,
  UpdatePharmacyCycleDto,
  UpdateReturnCycleDto,
} from './cycle.dto';
import { CycleService } from './cycle.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cycle')
export class CycleController {
  private logger = new Logger(CycleController.name);
  constructor(private cycleService: CycleService) {}

  // for homepage
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [ShortCycleDto] })
  @ApiUnauthorizedResponse()
  @Get('short')
  async getShortCycles(
    @Query('taskType') taskType: TaskType,
    @Req() request: Request,
  ): Promise<ShortCycleDto[]> {
    try {
      return this.cycleService.getShortForHomepage(
        request.user as UserInfo,
        taskType,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // for nurse new cycle page
  @ApiOkResponse({ type: Cycle })
  @ApiBadRequestResponse({
    description: 'return 400 if the latest cycle is the last cycle',
  })
  @Post('new')
  async createCycle(@Body() createCycleDto: CreateCycleDto): Promise<Cycle> {
    // find current cycle number
    const latestCycle = await this.cycleService.findLatestCycle(
      createCycleDto.caseId,
    );

    if (latestCycle) {
      // if the latest cycle is the last cycle, return bad request
      if (latestCycle.cycleNumber === latestCycle.aCase.totalCycles)
        throw new BadRequestException('The latest cycle is the last cycle');

      // if the latest cycle is cancelled, return bad request
      if (latestCycle.status === CycleStatus.CANCEL)
        throw new BadRequestException('The latest cycle is cancelled');

      // if the latest cycle is not completed, return bad request
      if (latestCycle.status !== CycleStatus.COMPLETE)
        throw new BadRequestException('The latest cycle is not completed');
    }

    try {
      return this.cycleService.createCycle(
        createCycleDto,
        latestCycle ? latestCycle.cycleNumber + 1 : 1,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // for doctor in select regimen page
  @ApiOkResponse({ type: OpenCycleDto })
  @Get('open/:cycleId')
  getOpenCycle(@Param('cycleId') cycleId: string): Promise<OpenCycleDto> {
    try {
      return this.cycleService.getOpenCycle(+cycleId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // for doctor in select regimen page
  @ApiOkResponse({ type: Cycle })
  @ApiBadRequestResponse({
    description: 'return 400 if cycle status is not open',
  })
  @Patch('open/:cycleId')
  async updateOpenCycle(
    @Param('cycleId') cycleId: string,
    @Body() updateOpenCycleDto: UpdateOpenCycleDto,
  ): Promise<Cycle> {
    // check if the cycle's status is open
    const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
    if (cycleStatus != CycleStatus.OPEN)
      throw new BadRequestException(
        "this cycle's regimen and drugs have already been specified",
      );

    try {
      return this.cycleService.updateOpenCycle(+cycleId, updateOpenCycleDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // for pharmacy recheck page
  @ApiOkResponse({ type: PharmacyCycleDto })
  @Get('pharmacy/:cycleId')
  getPharmacyCycle(
    @Param('cycleId') cycleId: string,
  ): Promise<PharmacyCycleDto> {
    try {
      return this.cycleService.getPharmacyCycle(+cycleId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // for pharmacy recheck page
  @ApiOkResponse({ type: Cycle })
  @ApiBadRequestResponse({
    description:
      'return 400 if cycle status is not pharmacy or some formulas are not found in the cycle',
  })
  @Patch('pharmacy/:cycleId')
  async updatePharmacyCycle(
    @Param('cycleId') cycleId: string,
    @Body() updatePharmacyCycleDto: UpdatePharmacyCycleDto,
  ): Promise<Cycle> {
    const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
    if (cycleStatus != CycleStatus.PHARMACY)
      throw new BadRequestException("this cycle's status is not for pharmacy");

    // check if all cycle formulas exist
    const cycleFormulas = await this.cycleService.findManyCycleFormulasByKeys(
      updatePharmacyCycleDto.formulas.map((formula) => ({
        cycleId: +cycleId,
        formulaId: formula.id,
      })),
    );
    if (cycleFormulas.length != updatePharmacyCycleDto.formulas.length) {
      this.logger.error(
        'some formulas are not found in the cycle or some formulas of the cycle are not specified in the request',
      );
      throw new BadRequestException(
        'some formulas are not found in the cycle or some formulas of the cycle are not specified in the request',
      );
    }

    try {
      return this.cycleService.updatePharmacyCycle(
        +cycleId,
        updatePharmacyCycleDto,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: CheckCycleDto })
  @ApiBadRequestResponse({
    description: 'return 400 if cycle status is not check',
  })
  @Get('check/:cycleId')
  async getCheckCycle(
    @Param('cycleId') cycleId: string,
  ): Promise<CheckCycleDto> {
    // check if the cycle's status is check
    const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
    if (cycleStatus != CycleStatus.CHECK)
      throw new BadRequestException("this cycle's status is not check");

    try {
      return this.cycleService.getCheckCycle(+cycleId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: Cycle })
  @ApiBadRequestResponse({
    description: 'return 400 if cycle status is not check',
  })
  @Patch('check/:cycleId')
  async updateCheckCycle(
    @Param('cycleId') cycleId: string,
    @Body() updateCheckCycleDto: UpdateCheckCycleDto,
  ): Promise<Cycle> {
    // check if the cycle's status is check
    const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
    if (cycleStatus != CycleStatus.CHECK)
      throw new BadRequestException("this cycle's status is not check");

    try {
      return this.cycleService.updateCheckCycle(+cycleId, updateCheckCycleDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: CostSummaryDto })
  @Get('cost-summary/:cycleId')
  async getCostSummary(
    @Param('cycleId') cycleId: string,
  ): Promise<CostSummaryDto> {
    try {
      return this.cycleService.getCostSummary(+cycleId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: AppointmentCycleDto })
  @ApiBadRequestResponse({
    description: 'return 400 if cycle status is not appointment',
  })
  @Get('appointment/:cycleId')
  async getAppointmentCycle(
    @Param('cycleId') cycleId: string,
  ): Promise<AppointmentCycleDto> {
    // check if the cycle's status is appointment
    const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
    if (cycleStatus != CycleStatus.APPOINTMENT)
      throw new BadRequestException("this cycle's status is not appointment");

    try {
      return this.cycleService.getAppointmentCycle(+cycleId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: Cycle })
  @ApiBadRequestResponse({
    description: 'return 400 if cycle status is not appointment',
  })
  @Patch('appointment/:cycleId')
  async updateAppointmentCycle(
    @Param('cycleId') cycleId: string,
    @Body() updateAppointmentCycleDto: UpdateAppointmentCycleDto,
  ): Promise<Cycle> {
    // check if the cycle's status is appointment
    const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
    if (cycleStatus != CycleStatus.APPOINTMENT)
      throw new BadRequestException("this cycle's status is not appointment");

    try {
      return this.cycleService.updateAppointmentCycle(
        +cycleId,
        updateAppointmentCycleDto,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: InventoryCycleDto })
  @ApiBadRequestResponse({
    description: 'return 400 if cycle status is not inventory',
  })
  @Get('inventory/:cycleId')
  async getInventory(
    @Param('cycleId') cycleId: string,
  ): Promise<InventoryCycleDto> {
    // check if the cycle's status is inventory
    const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
    if (cycleStatus != CycleStatus.INVENTORY)
      throw new BadRequestException("this cycle's status is not inventory");

    try {
      return this.cycleService.getInventoryCycle(+cycleId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: Cycle })
  @ApiBadRequestResponse({
    description: 'return 400 if cycle status is not inventory',
  })
  @Patch('inventory/:cycleId')
  async updateInventoryCycle(
    @Param('cycleId') cycleId: string,
    @Body() updateInventoryCycleDto: UpdateInventoryCycleDto,
  ): Promise<Cycle> {
    // check if the cycle's status is inventory
    const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
    if (cycleStatus != CycleStatus.INVENTORY)
      throw new BadRequestException("this cycle's status is not inventory");

    // check if all cycle bottles exist
    const cycleBottles = await this.cycleService.findManyCycleBottlesByKeys(
      updateInventoryCycleDto.bottlePurchases.map((drug) => ({
        cycleId: +cycleId,
        bottleId: drug.id,
      })),
    );
    if (cycleBottles.length != updateInventoryCycleDto.bottlePurchases.length) {
      this.logger.error(
        'some bottles are not found in the cycle or some bottles of the cycle are not specified in the request',
      );
      throw new BadRequestException(
        'some bottles are not found in the cycle or some bottles of the cycle are not specified in the request',
      );
    }

    try {
      return this.cycleService.updateInventoryCycle(
        +cycleId,
        updateInventoryCycleDto,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: Cycle })
  @ApiBadRequestResponse({
    description: 'return 400 if cycle status is not order',
  })
  @Patch('order/:cycleId')
  async updateOrderCycle(@Param('cycleId') cycleId: string): Promise<Cycle> {
    // check if the cycle's status is order
    const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
    if (cycleStatus != CycleStatus.ORDER)
      throw new BadRequestException("this cycle's status is not order");

    try {
      return this.cycleService.updateOrderCycle(+cycleId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: DrugSummaryDto })
  @Get('drug-summary/:cycleId')
  async getDrugSummary(
    @Param('cycleId') cycleId: string,
  ): Promise<DrugSummaryDto> {
    try {
      return this.cycleService.getDrugSummary(+cycleId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // add authentication guard
  // for pharmacy usage summary page
  @ApiOkResponse({ type: ReadyCycleDto })
  @ApiBadRequestResponse({
    description: 'return 400 if cycle status is not ready',
  })
  @Get('ready/:cycleId')
  async getReadyCycle(
    @Param('cycleId') cycleId: string,
  ): Promise<ReadyCycleDto> {
    // check if the cycle's status is ready
    const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
    if (cycleStatus != CycleStatus.READY)
      throw new BadRequestException("this cycle's status is not ready");

    try {
      return this.cycleService.getReadyCycle(+cycleId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: Cycle })
  @ApiBadRequestResponse({
    description:
      'return 400 if cycle status is not ready or some bottles are not found in the cycle',
  })
  @Patch('ready/:cycleId')
  async updateReturnBottles(
    @Param('cycleId') cycleId: string,
    @Body() returnBottlesDto: ReturnBottlesDto,
  ): Promise<Cycle> {
    // check if the cycle's status is ready
    const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
    if (cycleStatus != CycleStatus.READY)
      throw new BadRequestException("this cycle's status is not ready");

    // check if all bottles match the bottles of the cycle
    const cycleBottles = await this.cycleService.findManyCycleBottlesByKeys(
      returnBottlesDto.bottles.map((bottle) => ({
        cycleId: +cycleId,
        bottleId: bottle.id,
      })),
    );
    if (cycleBottles.length != returnBottlesDto.bottles.length) {
      this.logger.error(
        'some bottles are not found in the cycle or some bottles of the cycle are not specified in the request',
      );
      throw new BadRequestException(
        'some bottles are not found in the cycle or some bottles of the cycle are not specified in the request',
      );
    }

    // check if the return for each bottle is less than or equal to the quantity of the bottle
    for (let i = 0; i < returnBottlesDto.bottles.length; i++) {
      if (returnBottlesDto.bottles[i].return > cycleBottles[i].quantity) {
        this.logger.error(
          'the return for each bottle must be less than or equal to the quantity of the bottle',
        );
        throw new BadRequestException(
          'the return for each bottle must be less than or equal to the quantity of the bottle',
        );
      }
    }

    try {
      return this.cycleService.returnBottles(+cycleId, returnBottlesDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: ReturnCycleDto })
  @ApiBadRequestResponse({
    description: 'return 400 if cycle status is not return',
  })
  @Get('return/:cycleId')
  async getReturnCycle(
    @Param('cycleId') cycleId: string,
  ): Promise<ReturnCycleDto> {
    // check if the cycle's status is return
    const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
    if (cycleStatus != CycleStatus.RETURN)
      throw new BadRequestException("this cycle's status is not return");

    try {
      return this.cycleService.getReturnCycle(+cycleId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: Cycle })
  @ApiBadRequestResponse({
    description: 'return 400 if cycle status is not return',
  })
  @Patch('return/:cycleId')
  async updateReturnCycle(
    @Param('cycleId') cycleId: string,
    @Body() updateReturnCycleDto: UpdateReturnCycleDto,
  ): Promise<Cycle> {
    // check if the cycle's status is return
    const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
    if (cycleStatus != CycleStatus.RETURN)
      throw new BadRequestException("this cycle's status is not return");

    // check if all bottles match the bottles of the cycle
    const cycleBottles = await this.cycleService.findManyCycleBottlesByKeys(
      updateReturnCycleDto.bottles.map((bottle) => ({
        cycleId: +cycleId,
        bottleId: bottle.id,
      })),
    );
    if (cycleBottles.length != updateReturnCycleDto.bottles.length) {
      this.logger.error(
        'some bottles are not found in the cycle or some bottles of the cycle are not specified in the request',
      );
      throw new BadRequestException(
        'some bottles are not found in the cycle or some bottles of the cycle are not specified in the request',
      );
    }

    try {
      return this.cycleService.updateReturnCycle(
        +cycleId,
        updateReturnCycleDto,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: [AppointmentDto] })
  @Get('appointments')
  async getAppointments(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ): Promise<AppointmentDto[]> {
    try {
      return this.cycleService.getAppointments(fromDate, toDate);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: [ShortCycleDto] })
  @Get('by-case/:caseId')
  async getCyclesByCase(
    @Param('caseId') caseId: string,
  ): Promise<ShortCycleDto[]> {
    try {
      return this.cycleService.getByCaseId(+caseId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: [CycleByDateDto] })
  @Get('by-month')
  async getCyclesByMonth(
    @Query('month') month: string,
    @Query('year') year: string,
  ): Promise<CycleByDateDto[]> {
    try {
      return this.cycleService.getByMonth(+month, +year);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: DetailedCycleDto })
  @Get('detail/:cycleId')
  async getAppointDetail(
    @Param('cycleId') cycleId: string,
  ): Promise<DetailedCycleDto> {
    try {
      return this.cycleService.getDetailedCycle(+cycleId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: Cycle })
  @Patch('re-schedule/:cycleId')
  async reScheduleCycle(
    @Param('cycleId') cycleId: string,
    @Body() reScheduleCycleDto: ReScheduleCycleDto,
  ): Promise<Cycle> {
    try {
      return this.cycleService.reScheduleCycle(+cycleId, reScheduleCycleDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse({ type: Cycle })
  @Delete('cancel/:cycleId')
  async cancelCycle(@Param('cycleId') cycleId: string): Promise<Cycle> {
    try {
      const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
      if (cycleStatus == CycleStatus.COMPLETE)
        throw new BadRequestException('Cannot cancel a completed cycle');

      return this.cycleService.cancelCycle(+cycleId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOkResponse()
  @Delete(':cycleId')
  async deleteCycle(@Param('cycleId') cycleId: string): Promise<string> {
    try {
      const cycleStatus = await this.cycleService.getCycleStatus(+cycleId);
      if (cycleStatus != CycleStatus.CANCEL)
        throw new BadRequestException('Cannot delete a non-cancelled cycle');

      await this.cycleService.deleteCycle(+cycleId);

      return 'Deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
