interface NewRegimen {
  name: string;
  note: string | undefined;
  remark: string | undefined;
  medication: string | undefined;
  homeMed: string | undefined;
  usages: [
    {
      usage: string;
      formulas: [
        {
          name: string;
          drugId: number;
          formulaQuantity: number;
          formulaUnit: string;
          diluteDescription: string;
        }
      ];
    }
  ];
}

export default NewRegimen;
