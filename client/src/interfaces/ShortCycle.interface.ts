import { CycleStatus } from "../enums";

interface ShortCycle {
  id: number;
  patientHN: number;
  patientName: string;
  doctorName: string;
  regimenName?: string;
  status: CycleStatus;
  cycleNumber?: number;
}

export default ShortCycle;
