const getRegimenDrugDefaultData = async () => {
    // fetch Bankend
    return [
      {
        day: "DAY1",
        medicine: "Panitumumab (6 mg/kg)",
        note: "กุก้ยังไม่รู้คือไร จมดวะ",
        formulaquantity: "6",
        formulaunit: "mg/kg",
        demandunit: "mg",
        dilutedescription : "+ D5W drip คู่กับ leurocon(for big d)",
      },
      {
        day: "DAY1",
        medicine: "5FU (400 mg/m2)",
        note: "กุก้ยังไม่รู้คือไร จมดวะ",
        formulaquantity: "400",
        formulaunit: "mg/m2",
        demandunit: "mg",
        dilutedescription : "",
      },
      {
        day: "DAY1-2",
        medicine: "5FU (1200 mg/m2)",
        note: "กุก้ยังไม่รู้คือไร จมดวะ",
        formulaquantity: "1200",
        formulaunit: "mg/m2",
        demandunit: "mg",
        dilutedescription : "+ D5W drip คู่กับ leurocon(for big d)",
      },
    ];
  };
  
  const regimendrugdefault = {
    getRegimenDrugDefaultData,
  };
  
  export default regimendrugdefault;