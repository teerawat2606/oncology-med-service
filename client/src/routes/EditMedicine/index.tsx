// import { useState, useEffect } from "react";
// import Table from "./Table";
// import { patient, usagesummary, inventory } from "../../../../api";

// type UsageSummary = {
//   medicine: string;
//   size: string;
//   request: string;
// };
// type Patient = {
//   cyclenumber: string;
//   HN: string;
//   patientname: string;
//   regimen: string;
//   doctor: string;
// };
// type Inventory = {
//   medicine: string;
//   size: string;
//   reserved: string;
//   available: string;
//   total: string;
// };

const EditMedicine = () => {
  return <></>;
  // const [patientData, setPatientData] = useState<Patient[]>();
  // const [usagesummaryData, setUsageSummaryData] = useState<UsageSummary[]>();
  // const [inventoryData, setInventoryData] = useState<Inventory[]>();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setPatientData(await patient.getPatientData());
  //     setUsageSummaryData(await usagesummary.getUsageSummaryData());
  //     setInventoryData(await inventory.getInventoryData());
  //   };
  //   fetchData();
  // }, []);

  // return (
  //   <div className="page-container">
  //     {usagesummaryData ? (
  //       <Table
  //         patientData={patientData || []}
  //         usagesummaryData={usagesummaryData}
  //       />
  //     ) : (
  //       <></>
  //     )}
  //   </div>
  // );
};

export default EditMedicine;
