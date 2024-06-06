interface CheckCost
{
    bottles: 
      {
        id: number,
        quantity: number
      }[]
    ,
    WBCmedAddinfo: string,
    WBCmedCost: number,
    takehomeMedCost: number,
    doctorEquipmentCost: number,
    doctorExpertiseCost: number,
    bloodTestCost: number,
    premedCost: number
  }    
    export default CheckCost;