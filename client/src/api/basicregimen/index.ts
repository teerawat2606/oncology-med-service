const getBasicRegimenData = async () => {
    // fetch Bankend
    return [
      {
        regimen: "HN6 + FOLOX",
        regimen_id : "11111",
        treatment_type: "Chemotherapy",
        medication: [["day1","Panitumumab (6mg/kg)","50"],["day1","Oxaliplatin (85mg/m2)","49"],["day1","Leucovorin (400mg/m2)","48"],["day1-2","500FU (1200 mg/m2)","47"]],
        pre_medication : "rqw3etsrh6jyedulvdsfnxgtyugeszrhdxtrjjjjjubdkkkkkfjndbfnknkdfknbdnnbfjnkbfknbfxjbkbdbdzjkz df",
        remark : "remarkkkkkkkkkkkkkkkkkkkk12345678901234567891234567890",
        medicine_list : "1234567123456789123456789012345678901234567890",
        homemed: "09876543210987654321098765432109876543209876543210987654321"
      },
      {
        regimen: "BBBBBBBBB",
        regimen_id : "22222",
        treatment_type: "Chemotherapy",
        medication: [["day1","Panitumumab (6mg/kg)","50"],["day1","Oxaliplatin (85mg/m2)","49"],["day1","Leucovorin (400mg/m2)","48"],["day1-2","500FU (1200 mg/m2)","47"]],
        pre_medication : "rqw3etsrh6jyedulvdsfnxgtyugeszrhdxtrjjjjjubdkkkkkfjndbfnknkdfknbdnnbfjnkbfknbfxjbkbdbdzjkz df",
        remark : "remarkkkkkkkkkkkkkkkkkkkk12345678901234567891234567890",
        medicine_list : "1234567123456789123456789012345678901234567890",
        homemed: "09876543210987654321098765432109876543209876543210987654321"
      },
      {
        regimen: "CCCCCCCC",
        regimen_id : "33333",
        treatment_type: "Chemotherapy",
        medication: [["day1","Panitumumab (6mg/kg)","50"],["day1","Oxaliplatin (85mg/m2)","49"],["day1","Leucovorin (400mg/m2)","48"],["day1-2","500FU (1200 mg/m2)","47"]],
        pre_medication : "rqw3etsrh6jyedulvdsfnxgtyugeszrhdxtrjjjjjubdkkkkkfjndbfnknkdfknbdnnbfjnkbfknbfxjbkbdbdzjkz df",
        remark : "remarkkkkkkkkkkkkkkkkkkkk12345678901234567891234567890",
        medicine_list : "1234567123456789123456789012345678901234567890",
        homemed: "09876543210987654321098765432109876543209876543210987654321"
      },
    ];
  };
  
  const basicregimen = {
    getBasicRegimenData,
  };
  
  export default basicregimen;