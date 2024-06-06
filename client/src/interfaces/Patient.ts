interface Patient {
  HN: number;
  name: string;
  cases: {
    id: number;
    regimenName: string;
    doctorName: string;
  }[];
}

export default Patient;
