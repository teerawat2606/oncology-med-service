export interface CycleSummary {
    formulas: Array<{
      id: string;
      quantity: number;
      usage: string;
    }> | undefined;
    totalCycles: any;
    preMedication: string;
    regimenRemark: string;
    regimenMedication: string;
    regimenId: number;
    regimenHomeMedication: string;
    isEmer: boolean;
    isInsurance: boolean;
  }