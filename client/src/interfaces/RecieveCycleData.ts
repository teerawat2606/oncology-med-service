interface RecieveCycleData {
    id: number;
    patient: {
      HN: number;
      name: string;
      gender: string;
      age: number;
      BW: number;
      Ht: number;
      BSA: number;
      sCr: number;
      ClCrM : number;
      ClCrF : number;      
    }
    totalCycles : number;
    cycleNumber : number;
    regimen :{
      id : number;
      name : string;
    }
    ;
  }

  
  
  export default RecieveCycleData;