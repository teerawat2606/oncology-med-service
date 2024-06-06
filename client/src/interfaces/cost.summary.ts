interface CostSummary {
  patient: {
    HN: number;
    name: string;
    gender: string; // Assuming gender is a string
    age: number;
    BW: number;
    Ht: number;
    BSA: number;
    sCr: number;
    ClCrM: number;
    ClCrF: number;
    cycles: {
      id: number;
      patient: string;
      totalCycles: number;
      cycleNumber: number;
      preMedication: string;
      isEmer: boolean;
      status: string; // Assuming status is a string
      isInsurance: boolean;
      department: string;
      doctor: {
        id: number;
        username: string;
        password: string;
        role: string; // Assuming role is a string
        department: string;
        name: string;
        lineId: string;
        hospital: string;
      };
      nurse: {
        id: number;
        username: string;
        password: string;
        role: string; // Assuming role is a string
        department: string;
        name: string;
        lineId: string;
        hospital: string;
      };
      pharmacy: {
        id: number;
        username: string;
        password: string;
        role: string; // Assuming role is a string
        department: string;
        name: string;
        lineId: string;
        hospital: string;
      };
      pharmacyNote: string;
      inventory: {
        id: number;
        username: string;
        password: string;
        role: string; // Assuming role is a string
        department: string;
        name: string;
        lineId: string;
        hospital: string;
      };
      inventoryNote: string;
      inventoryPRdate: string;
      inventoryPRnumber: number;
      regimen: {
        id: number;
        name: string;
        note: string;
        remark: string;
        premedication: string;
        medication: string;
        homeMed: string;
        regimenFormulas: {
          regimenId: number;
          formulaId: number;
          regimen: string; // Assuming regimen is a string
          formula: {
            id: number;
            drugId: number;
            drug: {
              id: number;
              name: string;
              bottles: string[]; // Assuming bottles is an array of strings
              formulas: string[]; // Assuming formulas is an array of strings
            };
            formulaQuantity: number;
            maxFormulaQuantity: number;
            formulaUnit: string; // Assuming formulaUnit is a string
            diluteDescription: string;
            regimenFormulas: string[]; // Assuming regimenFormulas is an array of strings
            cycleFormulas: string[]; // Assuming cycleFormulas is an array of strings
          };
          usage: string;
        }[];
      };
      regimenRemark: string;
      regimenMedication: string;
      regimenHomeMedication: string;
      WBCmedAddinfo: string;
      WBCmedCost: number;
      takehomeMedCost: number;
      doctorEquipmentCost: number;
      doctorExpertiseCost: number;
      bloodTestCost: number;
      premedCost: number;
      cycleCost: number;
      cycleBottles: {
        cycleId: number;
        bottleId: number;
        cycle: string; // Assuming cycle is a string
        bottle: {
          id: number;
          drugId: number;
          drug: {
            id: number;
            name: string;
            bottles: string[]; // Assuming bottles is an array of strings
            formulas: string[]; // Assuming formulas is an array of strings
          };
          name: string;
          cost: number;
          inventory: number;
          cycleBottles: string[]; // Assuming cycleBottles is an array of strings
        };
        quantity: number;
        purchase: number;
        return: number;
        returnReceived: number;
      }[];
      cycleFormulas: {
        cycleId: number;
        formulaId: number;
        cycle: string; // Assuming cycle is a string
        formula: {
          id: number;
          drugId: number;
          drug: {
            id: number;
            name: string;
            bottles: string[]; // Assuming bottles is an array of strings
            formulas: string[]; // Assuming formulas is an array of strings
          };
          formulaQuantity: number;
          maxFormulaQuantity: number;
          formulaUnit: string; // Assuming formulaUnit is a string
          diluteDescription: string;
          regimenFormulas: string[]; // Assuming regimenFormulas is an array of strings
          cycleFormulas: string[]; // Assuming cycleFormulas is an array of strings
        };
        quantity: number;
        usage: string;
        location: string;
      }[];
      cycleLogs: {}[]; // Assuming cycleLogs is an array of objects
      appointmentDate: string;
    }[];
  };
  regimen: {
    id: number;
    name: string;
    note: string;
  };
  locations: string[];
  bottleQuantityCosts: string[];
  WBCmedAddinfo: string;
  WBCmedCost: number;
  takehomeMedCost: number;
  doctorEquipmentCost: number;
  doctorExpertiseCost: number;
  bloodTestCost: number;
  premedCost: number;
  cycleCost: number;
}

export default CostSummary;
