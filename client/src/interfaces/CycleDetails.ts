interface CycleDetails {
  id: number;
  caseId: number;
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
  doctorName: string;
  regimenName: string;
  appointmentDate: Date;
}

export default CycleDetails;
