interface CycleByMonth {
  date: string;
  cycles: [
    {
      id: number;
      patientName: string;
    }
  ];
}

export default CycleByMonth;
