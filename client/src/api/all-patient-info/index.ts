const getAllPatientInfo = async () => {
  // fetch Bankend
  return [
    {
      cyclenumber: "11111111",
      HN: "12345678",
      patientname: "Pear",
      gender: "Male",
      reservationdate: "16/12/2002",
      doctor: "shane",
      age: "21",
      BW: "55",
      Ht: "180",
      sCr: "0.9",
    },
  ];
};

const allpatientinfo = {
  getAllPatientInfo,
};

export default allpatientinfo;
