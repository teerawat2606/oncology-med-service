export interface IDrugSummaryBottles  {
  id: number,
  name: string,
  quantity: number,
  cost: number,
  inventory: number,
  return: number,
  purchase: number,
  returnReceived: number
}

interface IDrugSummary {


  id: number,
  patientName: string,
  appointmentDate: string,
  regimenName: string,
  bottles: IDrugSummaryBottles[],
  formulaLocations: [
    {
      id: number,
      quantity: number,
      location: string,
    }
  ]
}


export default IDrugSummary;