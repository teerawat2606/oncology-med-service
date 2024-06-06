const getPatientDetail = async () => {
  // fetch Bankend
  return [
    {
      no: "1",
      patientname: "Gust",
      reservationdate: "23/08/22",
      status: "Complete",
      action: "duplicate",
    },
    {
      no: "2",
      patientname: "Gust",
      reservationdate: "23/09/22",
      status: "Complete",
      action: "duplicate",
    },
    {
      no: "3",
      patientname: "Gust",
      reservationdate: "23/10/22",
      status: "Complete",
      action: "duplicate",
    },
    {
      no: "4",
      patientname: "Gust",
      reservationdate: "23/11/22",
      status: "Open",
      action: "duplicate",
    },
  ];
};

const patientdetail = {
  getPatientDetail,
};

export default patientdetail;
