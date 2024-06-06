interface RecieveRegimenDetailData {
    id: number;
    name: string;
    note:string;
    remark: string;
    premedication: string;
    medication: string;
    homeMed: string;
    regimenFormulas: {
        regimenId : number;
        formulaId : number;
        usage : string; //DAY
        formula :{
            id: string; //ตัวของ formula
            drugId: string;
            formulaQuantity: number; 
            maxFormulaQuantity: number; 
            formulaUnit: string; //mg/kg
            diluteDescription: string;
        }
    }[];
    }
  
  export default RecieveRegimenDetailData;