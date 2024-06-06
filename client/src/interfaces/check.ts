interface ICheck{
  // map(arg0: (card: any, index: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;

  id: number,
  regimenName: string,
  totalCycles: number,
  isInsurance: number,
  cycleNumber: number,
  preMedication: string,
  regimenRemark: string,
  regimenMedication: string,
  regimenHomeMedication: string,
  drugs: [
    {
      id: number,
      name: string,
      quantity: number,
      quantityUnit: string,
      bottles: [
        {
          id: number,
          name: string,
          quantity: number,
          cost: number,
          inventory: number,
          return: number,
          purchase: number,
          returnReceived: number
        }
      ]
    }
  ]
}

export default ICheck;