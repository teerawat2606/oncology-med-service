interface RecheckMedicineData {
  id: number;
  regimenRemark: string;
  patient: {
    HN: number;
    name: string;
    gender: string;
    age: number;
    BW: number;
    Ht: number;
    BSA: number;
    sCr: number;
    ClCrM: number;
    ClCrF: number;
  };
  regimen: {
    id: number;
    name: string;
  };
  formulas: {
    id: number;
    drug: {
      id: number;
      name: string;
    };
    formulaQuantity: number;
    maxFormulaQuantity: number;
    formulaUnit: string;
    doctorQuantity: number;
    computedFormulaQuantity: number;
    diff: number;
    quantityUnit: string;
  }[];
}
export default RecheckMedicineData;
