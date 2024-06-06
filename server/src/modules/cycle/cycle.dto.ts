import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Patient } from 'src/entities/patient.entity';
import { CycleStatus, FormulaUnit, Usage } from 'src/enums';
import { ShortDrugDto } from '../drug/drug.dto';
import { ShortPatientDto } from '../patient/patient.dto';
import { RegimenNameNote } from '../regimen/regimen.dto';
import { Regimen } from 'src/entities/regimen.entity';
import { BottleQuantityDto } from '../bottle/bottle.dto';
import { CycleFormula } from 'src/entities/cycleFormula.entity';
import { CycleBottle } from 'src/entities/cycleBottle.entity';

export class PatientMeasurements {
  @ApiProperty()
  age: number;

  @ApiProperty()
  BW: number;

  @ApiProperty()
  Ht: number;

  @ApiProperty()
  sCr: number;
}

export class CreateCycleDto {
  @ApiProperty()
  caseId: number;

  @ApiProperty()
  newPatientMeasurements: PatientMeasurements;
}

export class ShortCycleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  caseId: number;

  @ApiProperty()
  patientHN: number;

  @ApiProperty()
  patientName: string;

  @ApiProperty()
  doctorName: string;

  @ApiPropertyOptional()
  regimenName?: string;

  @ApiPropertyOptional()
  appointmentDate?: string;

  @ApiProperty()
  status: CycleStatus;

  @ApiPropertyOptional()
  totalCycles?: number;

  @ApiPropertyOptional()
  cycleNumber?: number;
}

export class CycleFormulaKeys {
  @ApiProperty()
  cycleId: number;

  @ApiProperty()
  formulaId: number;
}

export class CycleBottleKeys {
  @ApiProperty()
  cycleId: number;

  @ApiProperty()
  bottleId: number;
}

export class FormulaWithQuantityUsageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  usage: Usage;
}

export class OpenCycleDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: Patient })
  patient: Patient;

  @ApiProperty({ type: Regimen })
  regimen: Regimen;

  @ApiProperty()
  cycleNumber: number;

  // value is assigned if not a new case
  @ApiPropertyOptional()
  totalCycles?: number;
}

export class UpdateOpenCycleDto {
  @ApiProperty({ type: [FormulaWithQuantityUsageDto] })
  formulas: FormulaWithQuantityUsageDto[];

  // specified if it is a new case
  @ApiPropertyOptional()
  totalCycles?: number;

  @ApiPropertyOptional()
  preMedication?: string;

  // specified if it is a new case
  @ApiProperty()
  regimenId: number;

  @ApiPropertyOptional()
  regimenRemark?: string;

  @ApiPropertyOptional()
  regimenMedication?: string;

  @ApiPropertyOptional()
  regimenHomeMedication?: string;

  @ApiProperty()
  isEmer: boolean;

  @ApiProperty()
  isInsurance: boolean;
}

export class ShortRegimenDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class ComputedFormula {
  @ApiProperty()
  id: number;

  @ApiProperty()
  drug: ShortDrugDto;

  @ApiProperty()
  formulaQuantity: number;

  @ApiPropertyOptional()
  maxFormulaQuantity?: number;

  @ApiProperty()
  formulaUnit: FormulaUnit;

  @ApiProperty()
  doctorQuantity: number;

  @ApiProperty()
  computedFormulaQuantity: number;

  @ApiProperty()
  diff: number;

  @ApiProperty()
  usage: Usage;
}

export class PharmacyCycleDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  regimenRemark: string;

  @ApiProperty({ type: Patient })
  patient: Patient;

  @ApiProperty()
  doctorName: string;

  @ApiPropertyOptional({ type: ShortRegimenDto })
  regimen?: ShortRegimenDto;

  @ApiPropertyOptional({ type: [ComputedFormula] })
  formulas: ComputedFormula[];
}

export class BottleNameQuantityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;
}

export class FormulaWithQuantityLocationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quantity: number;

  @ApiPropertyOptional()
  location?: string;

  @ApiProperty()
  usage: Usage;
}

export class UpdatePharmacyCycleDto {
  @ApiProperty()
  pharmacyNote: string;

  @ApiProperty({ type: [FormulaWithQuantityLocationDto] })
  formulas: FormulaWithQuantityLocationDto[];

  @ApiProperty({ type: [BottleQuantityDto] })
  bottles: BottleQuantityDto[];
}

export class CycleBottleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  cost: number;

  @ApiProperty()
  inventory: number;

  @ApiPropertyOptional()
  return?: number;

  @ApiPropertyOptional()
  purchase?: number;

  @ApiPropertyOptional()
  returnReceived?: number;
}

export class DrugWithBottleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ type: [CycleBottleDto] })
  bottles: CycleBottleDto[];
}

export class CheckCycleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  regimenName: string;

  @ApiPropertyOptional()
  totalCycles?: number;

  @ApiPropertyOptional()
  isInsurance?: boolean;

  @ApiPropertyOptional()
  cycleNumber?: number;

  @ApiPropertyOptional()
  preMedication?: string;

  @ApiPropertyOptional()
  regimenRemark?: string;

  @ApiPropertyOptional()
  regimenMedication?: string;

  @ApiPropertyOptional()
  regimenHomeMedication?: string;

  @ApiProperty({ type: [DrugWithBottleDto] })
  drugs: DrugWithBottleDto[];
}

export class UpdateCheckCycleDto {
  @ApiPropertyOptional({ type: [BottleQuantityDto] })
  bottles?: BottleQuantityDto[];

  @ApiProperty()
  WBCmedAddinfo: string;

  @ApiProperty()
  WBCmedCost: number;

  @ApiProperty()
  takehomeMedCost: number;

  @ApiProperty()
  doctorEquipmentCost: number;

  @ApiProperty()
  doctorExpertiseCost: number;

  @ApiProperty()
  bloodTestCost: number;

  @ApiProperty()
  premedCost: number;
}

export class CalculatedBottleQuantityCostDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  calculatedCost: number;
}

export class CostSummaryDto {
  @ApiProperty()
  patient: Patient;

  @ApiPropertyOptional()
  regimen?: RegimenNameNote;

  @ApiProperty()
  locations: string[];

  @ApiProperty()
  bottleQuantityCosts: CalculatedBottleQuantityCostDto[];

  @ApiPropertyOptional()
  WBCmedAddinfo?: string;

  @ApiPropertyOptional()
  WBCmedCost?: number;

  @ApiPropertyOptional()
  takehomeMedCost?: number;

  @ApiPropertyOptional()
  doctorEquipmentCost?: number;

  @ApiPropertyOptional()
  doctorExpertiseCost?: number;

  @ApiPropertyOptional()
  bloodTestCost?: number;

  @ApiPropertyOptional()
  premedCost?: number;

  @ApiPropertyOptional()
  cycleCost?: number;
}

export class AppointmentCycleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  patient: ShortPatientDto;

  @ApiProperty()
  regimenName: string;

  @ApiProperty()
  doctorName: string;
}

export class UpdateAppointmentCycleDto {
  @ApiProperty()
  appointmentDate: Date;
}

export class InventoryCycleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  patient: ShortPatientDto;

  @ApiProperty()
  doctorName: string;

  @ApiProperty()
  regimenName: string;

  @ApiPropertyOptional()
  pharmacyNote?: string;

  @ApiProperty({ type: [DrugWithBottleDto] })
  drugs: DrugWithBottleDto[];
}

export class DrugSummaryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  patientHN: number;

  @ApiProperty()
  patientName: string;

  @ApiProperty()
  doctorName: string;

  @ApiProperty()
  appointmentDate: string;

  @ApiPropertyOptional()
  regimenName?: string;

  @ApiProperty({ type: [CycleBottleDto] })
  bottles: CycleBottleDto[];

  @ApiProperty({ type: [FormulaWithQuantityLocationDto] })
  formulaLocations: FormulaWithQuantityLocationDto[];
}

export class BottlePurchaseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  purchase: number;
}

export class UpdateInventoryCycleDto {
  @ApiProperty()
  inventoryPRnumber: number;

  @ApiProperty()
  inventoryPRdate: Date;

  @ApiProperty({ type: [BottlePurchaseDto] })
  bottlePurchases: BottlePurchaseDto[];

  @ApiProperty()
  inventoryNote: string;
}

export class ReadyCycleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  patient: ShortPatientDto;

  @ApiProperty()
  doctorName: string;

  @ApiProperty()
  regimenName: string;

  @ApiProperty({ type: [DrugWithBottleDto] })
  drugs: DrugWithBottleDto[];
}

export class BottleWithReturnDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  return: number;
}

export class ReturnBottlesDto {
  @ApiProperty({ type: [BottleWithReturnDto] })
  bottles: BottleWithReturnDto[];
}

export class ReturnCycleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  patient: ShortPatientDto;

  @ApiProperty()
  doctorName: string;

  @ApiProperty()
  regimenName: string;

  @ApiProperty({ type: [DrugWithBottleDto] })
  drugs: DrugWithBottleDto[];
}

export class BottleWithReturnReceivedDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  returnReceived: number;
}

export class UpdateReturnCycleDto {
  @ApiProperty({ type: [BottleWithReturnReceivedDto] })
  bottles: BottleWithReturnReceivedDto[];
}

export class FormulaDetail {
  @ApiProperty()
  id: number;

  @ApiProperty()
  drugName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  formulaQuantity: number;

  @ApiProperty()
  formulaUnit: FormulaUnit;

  @ApiProperty()
  usage: Usage;

  @ApiProperty()
  location: string;
}

export class AppointmentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  patientHN: number;

  @ApiProperty()
  patientName: string;

  @ApiProperty()
  appointmentDate: string;

  @ApiProperty()
  regimenName: string;

  @ApiProperty({ type: [BottleNameQuantityDto] })
  bottles: BottleNameQuantityDto[];

  @ApiProperty({ type: [FormulaDetail] })
  formulas: FormulaDetail[];
}

export class DetailedCycleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  caseId: number;

  @ApiProperty()
  patient: Patient;

  @ApiProperty()
  doctorName: string;

  @ApiPropertyOptional()
  regimenName?: string;

  @ApiPropertyOptional()
  formulas?: CycleFormula[];

  @ApiPropertyOptional()
  bottles?: CycleBottle[];

  @ApiPropertyOptional()
  appointmentDate?: string;
}

export class ReScheduleCycleDto {
  @ApiProperty()
  newAppointmentDate: Date;
}

export class CycleByDateDto {
  @ApiProperty()
  date: string;

  @ApiProperty({ type: [ShortCycleDto] })
  cycles: ShortCycleDto[];
}
