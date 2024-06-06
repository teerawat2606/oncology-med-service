interface InventoryReport {
    id: number;
    //อยากได้ patient hn
    //อยากได้ doctor
    patientName: string;
    appointmentDate: string;
    regimenName: string;
    bottles: Array<{
      id: number;
      name: string;
      quantity: number;
      cost: number;
      inventory: number;
      return: number;
      purchase: number;
      returnReceived: number;
    }>;
    formulaLocations: Array<{
      id: number;
      quantity: number;
      location: string;
    }>;
  }
  
  
  export default InventoryReport;