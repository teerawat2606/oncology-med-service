import { useEffect, useState } from "react";
import "./index.css";
import { medicine } from "../../api";
import Header from "./Header";

// type User = {
//   username: string;
//   role: string;
// };
// type Regimen = {
//   regimen: string;
//   medicine: string;
//   action: string;
// };
// type Medicine = {
//   price: string;
//   medicineName: string;
//   action: string;
// };

function MedAndRegPage() {
  // const [regimenData, setRegimenData] = useState<Array<Regimen>>();
  // const [medicineData, setMedicineData] = useState<Array<Medicine>>();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // setRegimenData(await regimen.getRegimenData());
  //     setMedicineData(await medicine.getMedicineData());
  //     setRegimenData(await regimen.getRegimen());
  //   };
  //   fetchData();
  // }, []);

  return (
    <div className="page-container-medandreg">
      <Header />
      {/* {regimenData ? <TableReg regimenData={regimenData} /> : <></>} */}
      {/* {medicineData ? <TableMed medicineData={medicineData} /> : <></>} */}
      {/* <TableMed medicineData={[medicine, price, action]}/> */}
    </div>
  );
}

export default MedAndRegPage;
