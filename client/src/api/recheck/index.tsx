const getRecheckMedicineData = async () => {
  // fetch Bankend
  return [
    {
      medicine: "00000001",
      doctorAmount: "00000001 1mg",
      formulaAmount: "4",
      difference: "5 %",
    },
    {
      medicine: "00000002",
      doctorAmount: "00000001 1mg",
      formulaAmount: "4",
      difference: "5 %",
    },
    {
      medicine: "00000003",
      doctorAmount: "00000001 1mg",
      formulaAmount: "4",
      difference: "5 %",
    },
    {
      medicine: "00000004",
      doctorAmount: "00000001 1mg",
      formulaAmount: "4",
      difference: "5 %",
    },
    {
      medicine: "00000005",
      doctorAmount: "00000001 1mg",
      formulaAmount: "4",
      difference: "5 %",
    },
  ];
};

const recheckmedicine = {
  getRecheckMedicineData,
};

export default recheckmedicine;
