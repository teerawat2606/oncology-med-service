import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { Cycle } from 'src/entities/cycle.entity';
import { CycleBottle } from 'src/entities/cycleBottle.entity';
import { CycleFormula } from 'src/entities/cycleFormula.entity';
import { Patient } from 'src/entities/patient.entity';
import { FormulaUnit, TaskType, UserRole } from 'src/enums';
import CycleStatus from 'src/enums/CycleStatus';
import { BottleService } from '../bottle/bottle.service';
import { UserInfo } from '../user/user.dto';
import {
  AppointmentCycleDto,
  CycleBottleKeys,
  CycleFormulaKeys,
  CheckCycleDto,
  ComputedFormula,
  CostSummaryDto,
  DrugSummaryDto,
  DrugWithBottleDto,
  InventoryCycleDto,
  PharmacyCycleDto,
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
  AppointmentDto,
  OpenCycleDto,
  DetailedCycleDto,
  ReScheduleCycleDto,
  CycleByDateDto,
  CreateCycleDto,
} from './cycle.dto';
import { CycleRepository } from './cycle.repository';
import { CycleBottleRepository } from './cycleBottle.repository';
import { CycleFormulaRepository } from './cycleFormula.repository';
import { CaseService } from '../case/case.service';
import { SurplusBottle } from '../bottle/bottle.dto';
import { PatientService } from '../patient/patient.service';

const getCycleStatusForHomePage = (role: string, taskType: TaskType) => {
  switch (role) {
    case UserRole.DOCTOR:
      return [CycleStatus.OPEN];
    case UserRole.NURSE:
      return taskType === TaskType.TODO
        ? [CycleStatus.CHECK]
        : [CycleStatus.APPOINTMENT];
    case UserRole.PHARMACY:
      return taskType === TaskType.TODO
        ? [CycleStatus.PHARMACY]
        : [CycleStatus.READY];
    case UserRole.INVENTORY:
      return taskType === TaskType.TODO
        ? [CycleStatus.INVENTORY, CycleStatus.RETURN]
        : [CycleStatus.ORDER];
    default:
      throw new Error(`cycleApi.fetchCycles: invalid role ${role}`);
  }
};

const computedQuantity = (
  patient: Patient,
  formulaQuantity: number,
  formulaUnit: FormulaUnit,
): number => {
  switch (formulaUnit) {
    case FormulaUnit.MG_M2:
      return formulaQuantity * patient.BSA;
    case FormulaUnit.MG_KG:
      return formulaQuantity * patient.BW;
    case FormulaUnit.AUC5:
      return (25 + patient.ClCrM) * 5;
    case FormulaUnit.MG:
      return formulaQuantity;
    default:
      throw new Error(`cycleService:computedQuantity: invalid formulaUnit`);
  }
};

const differencePercentage = (
  doctorQuantity: number,
  computedQuantity: number,
) => {
  // absolute of difference / doctorQuantity * 100, round to integer
  return Math.round(
    (Math.abs(doctorQuantity - computedQuantity) / doctorQuantity) * 100,
  );
};

const reduceToDrugWithBottles = (
  cycleFormulas: CycleFormula[],
  cycleBottles: CycleBottle[],
): DrugWithBottleDto[] =>
  cycleFormulas.reduce((acc, { quantity, formula }) => {
    const existingDrug = acc.find((drug) => drug.id === formula.drugId);
    if (!existingDrug)
      acc.push({
        id: formula.drugId,
        name: formula.drug.name,
        quantity,
        bottles: cycleBottles
          .filter(({ bottle }) => bottle.drugId === formula.drugId)
          .map(({ bottle, ...cycleBottleDetails }) => ({
            id: bottle.id,
            name: bottle.name,
            cost: bottle.cost,
            inventory: bottle.inventory,
            quantity: cycleBottleDetails.quantity,
            purchase: cycleBottleDetails.purchase,
            return: cycleBottleDetails.return,
            returnReceived: cycleBottleDetails.returnReceived,
          })),
      });
    else acc.find((drug) => drug.id === formula.drugId).quantity += quantity;

    return acc;
  }, []);

const dateOnly = (date: Date) => date.toISOString().split('T')[0];

@Injectable()
export class CycleService {
  private logger = new Logger(CycleService.name);
  constructor(
    @Inject(forwardRef(() => CaseService))
    private readonly caseService: CaseService,
    private readonly cycleRepository: CycleRepository,
    private readonly cycleFormulaRepository: CycleFormulaRepository,
    private readonly cycleBottleRepository: CycleBottleRepository,
    private readonly bottleService: BottleService,
    private readonly patientService: PatientService,
  ) {}

  async findAll(offset?: number, limit?: number): Promise<Cycle[]> {
    try {
      return this.cycleRepository.findAll(offset, limit);
    } catch (error) {
      this.logger.error(`CycleService:findAll ${error.message}`);
      throw error;
    }
  }

  async createFirstCycle(caseId: number): Promise<Cycle> {
    try {
      return this.cycleRepository.insertOne(caseId, 1);
    } catch (error) {
      this.logger.error(`CycleService:createFirstCycle ${error.message}`);
      throw error;
    }
  }

  async getShortForHomepage(
    user: UserInfo,
    taskType: TaskType,
  ): Promise<ShortCycleDto[]> {
    const statuses = getCycleStatusForHomePage(user.role, taskType);
    try {
      let cycles: Cycle[];
      if (user.role === UserRole.DOCTOR) {
        cycles = await this.cycleRepository.findShortByDoctor(user.id);
      }
      cycles = await this.cycleRepository.findShortByStatus(statuses);
      // map to ShortCycleDto
      return cycles.map((cycle) => ({
        id: cycle.id,
        caseId: cycle.aCase.id,
        patientHN: cycle.aCase.patient.HN,
        patientName: cycle.aCase.patient.name,
        doctorName: cycle.aCase.doctor.name,
        status: cycle.status,
        regimenName: cycle.aCase.regimen?.name,
        cycleNumber: cycle.cycleNumber,
      }));
    } catch (error) {
      this.logger.error(
        `CycleService:getShortForHomepage: ${JSON.stringify(error.message)}`,
      );
      throw error;
    }
  }

  async findLatestCycle(caseId: number): Promise<Cycle> {
    try {
      return this.cycleRepository.findLatestCycle(caseId);
    } catch (error) {
      this.logger.error(`CycleService:findLatestCycle ${error.message}`);
      throw error;
    }
  }

  async createCycle(
    createCycleDto: CreateCycleDto,
    cycleNumber: number,
  ): Promise<Cycle> {
    try {
      // get the HN from the case
      const { patient } = await this.caseService.findById(
        createCycleDto.caseId,
      );

      // update or insert patient
      await this.patientService.upsertOnePatient({
        HN: patient.HN,
        ...createCycleDto.newPatientMeasurements,
      });

      return this.cycleRepository.insertOne(createCycleDto.caseId, cycleNumber);
    } catch (error) {
      this.logger.error(
        `CycleService:createOneCycle: ${JSON.stringify(error.message)}`,
      );
      throw error;
    }
  }

  async getOpenCycle(cycleId: number): Promise<OpenCycleDto> {
    try {
      const cycle = await this.cycleRepository.findOneOpenCycle(cycleId);
      const { id, aCase } = cycle;

      // map to OpenCycleDto
      return {
        id: id,
        patient: aCase.patient,
        regimen: aCase.regimen,
        cycleNumber: cycle.cycleNumber,
        totalCycles: aCase.totalCycles,
      };
    } catch (error) {
      this.logger.error(`CycleService:getOneCycle ${error.message}`);
      throw error;
    }
  }

  async updateOpenCycle(
    cycleId: number,
    updateOpenCycleDto: UpdateOpenCycleDto,
  ): Promise<Cycle> {
    try {
      const { formulas, regimenId, totalCycles, ...rest } = updateOpenCycleDto;

      const cycleFormulas = formulas.map((formula) => ({
        cycleId,
        formulaId: formula.id,
        quantity: formula.quantity,
        usage: formula.usage,
      }));

      const existingCycle = await this.cycleRepository.findById(cycleId);
      const updatedCycle = this.cycleRepository.merge(existingCycle, {
        ...rest,
        cycleFormulas,
        // if use insurance, go to pharmacy, else go to check
        status: updateOpenCycleDto.isInsurance
          ? CycleStatus.PHARMACY
          : CycleStatus.CHECK,
      });

      // update regimen in case
      await this.caseService.updateOpenCase(
        existingCycle.caseId,
        totalCycles,
        regimenId,
      );

      return this.cycleRepository.cascadeUpdateOneCycle(updatedCycle);
    } catch (error) {
      this.logger.error(`CycleService:updateOpenCycle ${error.message}`);
      throw error;
    }
  }

  async getCycleStatus(cycleId: number): Promise<CycleStatus> {
    try {
      return (await this.cycleRepository.findById(cycleId)).status;
    } catch (error) {
      this.logger.error(`CycleService:getCycleStatus ${error.message}`);
      throw error;
    }
  }

  async getPharmacyCycle(cycleId: number): Promise<PharmacyCycleDto> {
    try {
      const pharmacyCycle =
        await this.cycleRepository.findOnePharmacyCycle(cycleId);

      const { id, regimenRemark, aCase, cycleFormulas } = pharmacyCycle;

      const formulas: ComputedFormula[] = cycleFormulas.map(
        ({ quantity, usage, formula }) => {
          const computedFormulaQuantity = computedQuantity(
            aCase.patient,
            formula.formulaQuantity,
            formula.formulaUnit,
          );
          return {
            id: formula.id,
            formulaQuantity: formula.formulaQuantity,
            formulaUnit: formula.formulaUnit,
            drug: formula.drug,
            doctorQuantity: quantity,
            computedFormulaQuantity: computedFormulaQuantity,
            diff: differencePercentage(quantity, computedFormulaQuantity),
            usage: usage,
          };
        },
      );

      return {
        id,
        regimenRemark,
        patient: aCase.patient,
        regimen: aCase.regimen,
        formulas,
        doctorName: aCase.doctor.name,
      };
    } catch (error) {
      this.logger.error(`CycleService:getPharmacyCycle ${error.message}`);
      throw error;
    }
  }

  async findManyCycleFormulasByKeys(
    cycleFormulaKeys: CycleFormulaKeys[],
  ): Promise<CycleFormula[]> {
    try {
      return this.cycleFormulaRepository.findManyByKeys(cycleFormulaKeys);
    } catch (error) {
      this.logger.error(`CycleService:findManyCycleFormulas ${error.message}`);
      throw error;
    }
  }

  async findManyCycleBottlesByKeys(
    cycleBottleKeys: CycleBottleKeys[],
  ): Promise<CycleBottle[]> {
    try {
      return this.cycleBottleRepository.findManyByKeys(cycleBottleKeys);
    } catch (error) {
      this.logger.error(`CycleService:findManyCycleFormulas ${error.message}`);
      throw error;
    }
  }

  async updatePharmacyCycle(
    cycleId: number,
    updatePharmacyCycleDto: UpdatePharmacyCycleDto,
  ): Promise<Cycle> {
    try {
      // cycle formulas with updated quantities
      const cycleFormulas: CycleFormula[] = updatePharmacyCycleDto.formulas.map(
        (formula) => ({
          cycleId,
          formulaId: formula.id,
          quantity: formula.quantity,
          location: formula.location,
          usage: formula.usage,
        }),
      );

      // new cycle bottles
      const cycleBottles: CycleBottle[] = updatePharmacyCycleDto.bottles
        .filter((bottle) => bottle.quantity)
        .map((bottle) => ({
          cycleId,
          bottleId: bottle.id,
          quantity: bottle.quantity,
        }));

      // get existing cycle
      const existingCycle = await this.cycleRepository.findById(cycleId);
      const updatedCycle = this.cycleRepository.merge(existingCycle, {
        cycleBottles,
        cycleFormulas,
        pharmacyNote: updatePharmacyCycleDto.pharmacyNote,
        // if use insurance, go to check, else go to appointment
        status: existingCycle.isInsurance
          ? CycleStatus.CHECK
          : CycleStatus.APPOINTMENT,
      });

      return this.cycleRepository.cascadeUpdateOneCycle(updatedCycle);
    } catch (error) {
      this.logger.error(`CycleService:updatePharmacyCycle ${error.message}`);
      throw error;
    }
  }

  async getCheckCycle(cycleId: number): Promise<CheckCycleDto> {
    try {
      const checkCycle = await this.cycleRepository.findOneCheckCycle(cycleId);
      const { cycleFormulas, cycleBottles, aCase, ...cycleDetails } =
        checkCycle;
      console.log(checkCycle);

      const drugs = reduceToDrugWithBottles(cycleFormulas, cycleBottles);

      return {
        id: cycleDetails.id,
        totalCycles: aCase.totalCycles,
        isInsurance: cycleDetails.isInsurance,
        cycleNumber: cycleDetails.cycleNumber,
        preMedication: cycleDetails.preMedication,
        regimenRemark: cycleDetails.regimenRemark,
        regimenMedication: cycleDetails.regimenMedication,
        regimenHomeMedication: cycleDetails.regimenHomeMedication,
        regimenName: aCase.regimen.name,
        drugs,
      };
    } catch (error) {
      this.logger.error(`CycleService:getCheckCycle ${error.message}`);
      throw error;
    }
  }

  async updateCheckCycle(
    cycleId: number,
    updateCheckCycleDto: UpdateCheckCycleDto,
  ): Promise<Cycle> {
    try {
      const isBottlesSpecified = updateCheckCycleDto.bottles?.length > 0;

      // if bottles are not specified, use existing cycle bottles
      let newCycleBottles: CycleBottle[];
      let drugCost: number;
      if (isBottlesSpecified) {
        newCycleBottles = updateCheckCycleDto.bottles.map((bottle) => ({
          cycleId,
          bottleId: bottle.id,
          quantity: bottle.quantity,
        }));

        const bottlesWithCost = await this.bottleService.getBottleWithCost(
          updateCheckCycleDto.bottles.map((bottle) => bottle.id),
        );

        drugCost = bottlesWithCost.reduce(
          (acc, bottle) =>
            acc +
            bottle.cost *
              newCycleBottles.find((cb) => cb.bottleId === bottle.id).quantity,
          0,
        );
      } else {
        const cycleBottles =
          await this.cycleBottleRepository.findManyByCycleId(cycleId);

        drugCost = cycleBottles.reduce(
          (acc, cycleBottle) =>
            acc + cycleBottle.bottle.cost * cycleBottle.quantity,
          0,
        );
      }

      const cycleCost =
        updateCheckCycleDto.WBCmedCost +
        updateCheckCycleDto.takehomeMedCost +
        updateCheckCycleDto.doctorEquipmentCost +
        updateCheckCycleDto.doctorExpertiseCost +
        updateCheckCycleDto.bloodTestCost +
        updateCheckCycleDto.premedCost +
        drugCost;

      const existingCycle = await this.cycleRepository.findById(cycleId);
      const updatedCycle = isBottlesSpecified
        ? this.cycleRepository.merge(existingCycle, {
            ...updateCheckCycleDto,
            cycleCost,
            // if bottles are specified, use new cycle bottles
            cycleBottles: newCycleBottles,
            // if use insurance, go to pharmacy, else go to appointment
            status: existingCycle.isInsurance
              ? CycleStatus.APPOINTMENT
              : CycleStatus.PHARMACY,
          })
        : this.cycleRepository.merge(existingCycle, {
            ...updateCheckCycleDto,
            cycleCost,
            status: existingCycle.isInsurance
              ? CycleStatus.APPOINTMENT
              : CycleStatus.PHARMACY,
          });

      return this.cycleRepository.cascadeUpdateOneCycle(updatedCycle);
    } catch (error) {
      this.logger.error(`CycleService:updateCheckCycle ${error.message}`);
      throw error;
    }
  }

  async getCostSummary(cycleId: number): Promise<CostSummaryDto> {
    try {
      const costSummary =
        await this.cycleRepository.findOneCostSummary(cycleId);
      const { aCase, cycleBottles, cycleFormulas, ...cycleDetails } =
        costSummary;

      const bottleQuantityCosts = cycleBottles.map((cycleBottle) => ({
        id: cycleBottle.bottleId,
        name: cycleBottle.bottle.name,
        quantity: cycleBottle.quantity,
        calculatedCost: cycleBottle.bottle.cost * cycleBottle.quantity,
      }));

      return {
        ...cycleDetails,
        regimen: aCase.regimen,
        patient: aCase.patient,
        locations: cycleFormulas
          .filter((cycleFormula) => cycleFormula.location)
          .map((cycleFormula) => cycleFormula.location),
        bottleQuantityCosts,
      };
    } catch (error) {
      this.logger.error(`CycleService:getCostSummary ${error.message}`);
      throw error;
    }
  }

  async getAppointmentCycle(cycleId: number): Promise<AppointmentCycleDto> {
    try {
      const appointmentCycle =
        await this.cycleRepository.findOneAppointmentCycle(cycleId);
      const { id, aCase } = appointmentCycle;

      return {
        id,
        patient: aCase.patient,
        regimenName: aCase.regimen.name,
        doctorName: aCase.doctor.name,
      };
    } catch (error) {
      this.logger.error(`CycleService:getAppointmentCycle ${error.message}`);
      throw error;
    }
  }

  async updateAppointmentCycle(
    cycleId: number,
    updateAppointmentCycleDto: UpdateAppointmentCycleDto,
  ) {
    try {
      const existingCycle = await this.cycleRepository.findById(cycleId);
      const updatedCycle = this.cycleRepository.merge(existingCycle, {
        appointmentDate: dateOnly(
          new Date(updateAppointmentCycleDto.appointmentDate),
        ),
        status: CycleStatus.INVENTORY,
      });

      return this.cycleRepository.cascadeUpdateOneCycle(updatedCycle);
    } catch (error) {
      this.logger.error(`CycleService:updateAppointmentCycle ${error.message}`);
      throw error;
    }
  }

  async getInventoryCycle(cycleId: number): Promise<InventoryCycleDto> {
    try {
      const inventoryCycle =
        await this.cycleRepository.findOneInventoryCycle(cycleId);
      const { id, aCase, cycleFormulas, cycleBottles, pharmacyNote } =
        inventoryCycle;

      const drugs = reduceToDrugWithBottles(cycleFormulas, cycleBottles);

      return {
        id,
        patient: aCase.patient,
        doctorName: aCase.doctor.name,
        regimenName: aCase.regimen.name,
        drugs,
        pharmacyNote,
      };
    } catch (error) {
      this.logger.error(
        `CycleService:getInventoryCycle: ${JSON.stringify(error.message)}`,
      );
      throw error;
    }
  }

  async updateInventoryCycle(
    cycleId: number,
    updateInventoryCycleDto: UpdateInventoryCycleDto,
  ) {
    try {
      const {
        inventoryNote,
        inventoryPRdate,
        inventoryPRnumber,
        bottlePurchases,
      } = updateInventoryCycleDto;
      // get existing cycle bottles
      const existingCycleBottles =
        await this.cycleBottleRepository.findManyByCycleId(cycleId);

      // combine existing cycle bottles with new bottle purchases
      bottlePurchases.forEach((bottlePurchase) => {
        const existingCycleBottle = existingCycleBottles.find(
          (cycleBottle) => cycleBottle.bottleId === bottlePurchase.id,
        );
        existingCycleBottle.purchase = bottlePurchase.purchase;
      });

      // use bottles
      const obtainedBottles = await this.bottleService.useBottles(
        existingCycleBottles.map(({ bottleId, ...rest }) => ({
          id: bottleId,
          ...rest,
        })),
      );

      // update cycle bottles
      const cycleBottles = obtainedBottles.map((bottle) => ({
        cycleId,
        bottleId: bottle.id,
        quantity: bottle.requested,
        purchase: bottle.purchase,
        obtained: bottle.obtained,
      }));

      const existingCycle = await this.cycleRepository.findById(cycleId);
      const updatedCycle = this.cycleRepository.merge(existingCycle, {
        inventoryNote,
        inventoryPRdate: dateOnly(new Date(inventoryPRdate)),
        inventoryPRnumber,
        cycleBottles,
        status: CycleStatus.ORDER,
      });

      return this.cycleRepository.cascadeUpdateOneCycle(updatedCycle);
    } catch (error) {
      this.logger.error(`CycleService:updateInventoryCycle ${error.message}`);
      throw error;
    }
  }

  async updateOrderCycle(cycleId: number) {
    // update obtained and inventory
    const existingCycleBottles =
      await this.cycleBottleRepository.findManyByCycleId(cycleId);

    const surplusBottles: SurplusBottle[] = [];

    const updatedCycleBottles = existingCycleBottles.map((cycleBottle) => {
      const { quantity, obtained, purchase, bottleId, cycleId } = cycleBottle;
      const surplus = purchase + obtained - quantity;

      if (surplus > 0) surplusBottles.push({ id: bottleId, surplus });

      return {
        cycleId,
        bottleId,
        obtained: quantity,
      };
    });

    // if there are excess bottles, add to inventory
    if (surplusBottles.length > 0)
      await this.bottleService.addInventory(surplusBottles);

    const existingCycle = await this.cycleRepository.findById(cycleId);
    const updatedCycle = this.cycleRepository.merge(existingCycle, {
      cycleBottles: updatedCycleBottles,
      status: CycleStatus.READY,
    });

    return this.cycleRepository.cascadeUpdateOneCycle(updatedCycle);
  }

  async getDrugSummary(cycleId: number): Promise<DrugSummaryDto> {
    try {
      const drugSummary =
        await this.cycleRepository.findOneDrugSummary(cycleId);
      const { id, aCase, appointmentDate, cycleFormulas, cycleBottles } =
        drugSummary;

      const bottles = cycleBottles.map((cycleBottle) => ({
        id: cycleBottle.bottleId,
        name: cycleBottle.bottle.name,
        cost: cycleBottle.bottle.cost,
        inventory: cycleBottle.bottle.inventory,
        quantity: cycleBottle.quantity,
      }));

      const formulaLocations = cycleFormulas.map((cycleFormula) => ({
        id: cycleFormula.formulaId,
        location: cycleFormula.location,
        quantity: cycleFormula.quantity,
        usage: cycleFormula.usage,
      }));

      return {
        id,
        patientHN: aCase.patient.HN,
        patientName: aCase.patient.name,
        doctorName: aCase.doctor.name,
        appointmentDate: appointmentDate,
        regimenName: aCase.regimen?.name,
        bottles,
        formulaLocations,
      };
    } catch (error) {
      this.logger.error(`CycleService:getDrugSummary ${error.message}`);
      throw error;
    }
  }

  async getReadyCycle(cycleId: number): Promise<ReadyCycleDto> {
    try {
      const usageSummary =
        await this.cycleRepository.findOneForUsageSummary(cycleId);
      const { id, aCase, cycleFormulas, cycleBottles } = usageSummary;

      const drugs = reduceToDrugWithBottles(cycleFormulas, cycleBottles);

      return {
        id,
        patient: aCase.patient,
        doctorName: aCase.doctor.name,
        regimenName: aCase.regimen.name,
        drugs,
      };
    } catch (error) {
      this.logger.error(
        `CycleService:getUsageSummary: ${JSON.stringify(error.message)}`,
      );
      throw error;
    }
  }

  async returnBottles(
    cycleId: number,
    returnBottlesDto: ReturnBottlesDto,
  ): Promise<Cycle> {
    try {
      const cycleBottles = returnBottlesDto.bottles.map((bottle) => ({
        cycleId,
        bottleId: bottle.id,
        return: bottle.return,
      }));

      const existingCycle = await this.cycleRepository.findById(cycleId);
      const updatedCycle = this.cycleRepository.merge(existingCycle, {
        cycleBottles,
        // if returns are all zero, go to complete, else go to return
        status: returnBottlesDto.bottles.every((bottle) => bottle.return === 0)
          ? CycleStatus.COMPLETE
          : CycleStatus.RETURN,
      });

      return this.cycleRepository.cascadeUpdateOneCycle(updatedCycle);
    } catch (error) {
      this.logger.error(`CycleService:returnBottles ${error.message}`);
      throw error;
    }
  }

  async getReturnCycle(cycleId: number): Promise<ReturnCycleDto> {
    try {
      const returnCycle =
        await this.cycleRepository.findOneReturnCycle(cycleId);
      const { id, aCase, cycleFormulas, cycleBottles } = returnCycle;

      const drugs = reduceToDrugWithBottles(cycleFormulas, cycleBottles);

      return {
        id,
        patient: aCase.patient,
        doctorName: aCase.doctor.name,
        regimenName: aCase.regimen.name,
        drugs,
      };
    } catch (error) {
      this.logger.error(`CycleService:getReturnCycle ${error.message}`);
      throw error;
    }
  }

  async updateReturnCycle(
    cycleId: number,
    updateReturnCycleDto: UpdateReturnCycleDto,
  ) {
    try {
      const surplusBottles: SurplusBottle[] = [];
      const cycleBottles = updateReturnCycleDto.bottles.map((bottle) => {
        if (bottle.returnReceived)
          surplusBottles.push({
            id: bottle.id,
            surplus: bottle.returnReceived,
          });

        return {
          cycleId,
          bottleId: bottle.id,
          returnReceived: bottle.returnReceived,
        };
      });

      // if there are excess bottles, add to inventory
      if (surplusBottles.length > 0)
        await this.bottleService.addInventory(surplusBottles);

      const existingCycle = await this.cycleRepository.findById(cycleId);
      const updatedCycle = this.cycleRepository.merge(existingCycle, {
        cycleBottles,
        status: CycleStatus.COMPLETE,
      });

      return this.cycleRepository.cascadeUpdateOneCycle(updatedCycle);
    } catch (error) {
      this.logger.error(`CycleService:updateReturnCycle ${error.message}`);
      throw error;
    }
  }

  async getAppointments(
    fromDate: string,
    toDate: string,
  ): Promise<AppointmentDto[]> {
    try {
      const cycles = await this.cycleRepository.findAppointments(
        dateOnly(new Date(fromDate)),
        dateOnly(new Date(toDate)),
      );

      return cycles.map((cycle) => {
        const { id, aCase, appointmentDate, cycleBottles, cycleFormulas } =
          cycle;
        return {
          id,
          patientHN: aCase.patient.HN,
          patientName: aCase.patient.name,
          appointmentDate,
          regimenName: aCase.regimen?.name,
          bottles: cycleBottles.map((cycleBottle) => ({
            id: cycleBottle.bottleId,
            name: cycleBottle.bottle.name,
            quantity: cycleBottle.quantity,
          })),
          formulas: cycleFormulas.map((cycleFormula) => ({
            id: cycleFormula.formulaId,
            drugName: cycleFormula.formula?.drug?.name,
            location: cycleFormula.location,
            quantity: cycleFormula.quantity,
            formulaQuantity: cycleFormula.formula?.formulaQuantity,
            formulaUnit: cycleFormula.formula?.formulaUnit,
            usage: cycleFormula.usage,
          })),
        };
      });
    } catch (error) {
      this.logger.error(`CycleService:getAppointments ${error.message}`);
      throw error;
    }
  }

  async getByCaseId(caseId: number): Promise<ShortCycleDto[]> {
    try {
      const cycles = await this.cycleRepository.findByCaseId(caseId);

      return cycles.map((cycle) => {
        const { id, aCase, status, cycleNumber, appointmentDate } = cycle;
        return {
          id,
          caseId: aCase.id,
          patientHN: aCase.patient.HN,
          patientName: aCase.patient.name,
          doctorName: aCase.doctor.name,
          regimenName: aCase.regimen?.name,
          appointmentDate,
          status,
          totalCycles: aCase.totalCycles,
          cycleNumber,
        };
      });
    } catch (error) {
      this.logger.error(`CycleService:getByPatientId ${error.message}`);
      throw error;
    }
  }

  async getByMonth(month: number, year: number): Promise<CycleByDateDto[]> {
    try {
      const cycles = await this.cycleRepository.findByMonth(month, year);

      const cyclesByDateObj = cycles.reduce((acc, cycle) => {
        const { id, aCase, status, cycleNumber, appointmentDate } = cycle;
        const value = {
          id,
          caseId: aCase.id,
          patientHN: aCase.patient.HN,
          patientName: aCase.patient.name,
          doctorName: aCase.doctor.name,
          regimenName: aCase.regimen?.name,
          appointmentDate,
          status,
          totalCycles: aCase.totalCycles,
          cycleNumber,
        };

        if (acc[appointmentDate]) acc[appointmentDate].push(value);
        else acc[appointmentDate] = [value];

        return acc;
      }, {});

      // map to CycleByDateDto
      return Object.keys(cyclesByDateObj).map((key) => ({
        date: key,
        cycles: cyclesByDateObj[key],
      }));
    } catch (error) {
      this.logger.error(`CycleService:getByMonth ${error.message}`);
      throw error;
    }
  }

  async getDetailedCycle(cycleId: number): Promise<DetailedCycleDto> {
    try {
      const cycle = await this.cycleRepository.findDetailById(cycleId);
      const { id, aCase, cycleFormulas, cycleBottles, appointmentDate } = cycle;

      // map to DetailedCycleDto
      return {
        id,
        caseId: aCase.id,
        patient: aCase.patient,
        doctorName: aCase.doctor.name,
        regimenName: aCase.regimen?.name,
        formulas: cycleFormulas,
        bottles: cycleBottles,
        appointmentDate,
      };
    } catch (error) {
      this.logger.error(`CycleService:getDetailedCycle ${error.message}`);
      throw error;
    }
  }

  async reScheduleCycle(
    cycleId: number,
    reScheduleCycleDto: ReScheduleCycleDto,
  ): Promise<Cycle> {
    try {
      const existingCycle = await this.cycleRepository.findById(cycleId);
      const updatedCycle = this.cycleRepository.merge(existingCycle, {
        appointmentDate: dateOnly(
          new Date(reScheduleCycleDto.newAppointmentDate),
        ),
      });

      return this.cycleRepository.cascadeUpdateOneCycle(updatedCycle);
    } catch (error) {
      this.logger.error(`CycleService:reScheduleCycle ${error.message}`);
      throw error;
    }
  }

  async cancelCycle(cycleId: number): Promise<Cycle> {
    try {
      const existingCycle = await this.cycleRepository.findById(cycleId);
      const updatedCycle = this.cycleRepository.merge(existingCycle, {
        status: CycleStatus.CANCEL,
      });

      return this.cycleRepository.cascadeUpdateOneCycle(updatedCycle);
    } catch (error) {
      this.logger.error(`CycleService:cancelCycle ${error.message}`);
      throw error;
    }
  }

  async deleteCycle(cycleId: number): Promise<void> {
    try {
      const cycle = await this.cycleRepository.findById(cycleId);

      await this.cycleRepository.deleteOneCycle(cycleId);

      if (cycle.cycleNumber === 1) {
        await this.caseService.deleteCase(cycle.caseId);
      }
    } catch (error) {
      this.logger.error(`CycleService:deleteCycle ${error.message}`);
      throw error;
    }
  }
}
