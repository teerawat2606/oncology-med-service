const getMedRequestData = async () => {
    // fetch Bankend
    return [
      {
        medicine: "00000001",
        size: "00000001 1mg",
        request: "4",
        inventory: "10"
      },
      {
        medicine: "00000002",
        size: "00000002 1mg",
        request: "1",
        inventory: "45"
      },
      {
        medicine: "00000002",
        size: "00000002 2mg",
        request: "3",
        inventory: "76"
      },
      {
        medicine: "00000003",
        size: "00000003 1mg",
        request: "1",
        inventory: "10"
      },
      {
        medicine: "00000003",
        size: "00000003 2mg",
        request: "2",
        inventory: "10"
      },
      {
        medicine: "00000003",
        size: "00000003 3mg",
        request: "3",
        inventory: "10"
      },
      {
        medicine: "00000003",
        size: "00000003 4mg",
        request: "4",
        inventory: "10"
      },
      {
        medicine: "00000003",
        size: "00000003 5mg",
        request: "5",
        inventory: "10"
      },
    ];
  };
  
  const medrequest = {
    getMedRequestData,
  };
  
  export default medrequest;
  