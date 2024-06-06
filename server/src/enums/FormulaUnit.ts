enum FormulaUnit {
  MG_M2 = 'mg/m2', // calculatedQuantity = formulaQuantity * BSA
  MG_KG = 'mg/kg', // calculatedQuantity = formulaQuantity * BW
  AUC5 = 'AUC5', // calculatedQuantity = (25 + ClCrM) * 5
  MG = 'mg', // calculatedQuantity = formulaQuantity
}

export default FormulaUnit;
