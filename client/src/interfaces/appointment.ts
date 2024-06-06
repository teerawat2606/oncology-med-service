export interface Appointment {
  id: number; 
  patient: {
    HN: number; 
    name: string;
  };
  regimenName: string;
  doctorName: string;
}