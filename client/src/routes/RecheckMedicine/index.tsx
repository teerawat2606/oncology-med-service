import { useState, useEffect } from "react";
import Table, { PatientData } from "./Table";
import Tablenext from "./Tablenext";
import useUserAPI from "../../api/user";
import {
  patient,
  patientinfo,
  recheckmedicine,
  inventory,
  cycleApi,
} from "../../api";
import { RecheckMedicineData } from "../../interfaces";
import { useParams } from "react-router";
export type PatientInfo = {
  name: string;
  age: number;
  BW: number;
  Ht: number;
  sCr: number;
  BSA: number;
  ClCrM: number;
  ClCrF: number;
  regimenRemark: string;
};

export type RecheckMedicine = {
  formulaId: number;
  drugName: string;
  drugId: number;
  formulaQuantity: number;
  formulaUnit: string;
  doctorAmount: number;
  formulaAmount: number;
  difference: number;
  pharmacyAmount?: number;
  location?: string;
};

export type Inventory = {
  medicine: string;
  size: string;
  reserved: string;
  available: string;
  total: string;
};

const RecheckMedicine = () => {
  const { cycleId } = useParams();
  const [patientData, setPatientData] = useState<PatientData>();
  const [patientinfoData, setPatientInfoData] = useState<PatientInfo>();
  const [recheckMedicine, setRecheckMedicine] = useState<RecheckMedicine[]>();
  const [inventoryData, setInventoryData] = useState<Inventory[]>();
  const [tab, setTab] = useState("1");
  useEffect(() => {
    console.log(cycleId);
    if (cycleId) {
      const fetchData = async () => {
        console.log(cycleId);
        const allRecheckMedicineData = await cycleApi.getRecheckMedicine(
          Number(cycleId)
        );
        console.log(allRecheckMedicineData);
        setPatientData(
          allRecheckMedicineData && {
            HN: allRecheckMedicineData.patient.HN,
            patientName: allRecheckMedicineData.patient.name,
            regimenName: allRecheckMedicineData.regimen.name,
          }
        );
        setPatientInfoData(
          allRecheckMedicineData && {
            ...allRecheckMedicineData.patient,
            regimenRemark: allRecheckMedicineData.regimenRemark,
          }
        );
        setRecheckMedicine(
          allRecheckMedicineData &&
            allRecheckMedicineData.formulas.map((formula, index) => {
              const {
                id,
                doctorQuantity,
                computedFormulaQuantity,
                diff,
                drug,
                ...rest
              } = formula;
              return {
                formulaId: id,
                doctorAmount: doctorQuantity,
                formulaAmount: computedFormulaQuantity,
                difference: diff,
                drugName: drug.name,
                drugId: drug.id,
                ...rest,
              };
            })
        );
        setInventoryData(await inventory.getInventoryData());
      };
      fetchData();
    }
  }, [cycleId]);

  return (
    <div className="page-container">
      {patientData ? (
        tab === "1" ? (
          <Table
            patientData={patientData}
            patientinfoData={patientinfoData}
            recheckmedicineData={recheckMedicine}
            setRecheckMedicineData={setRecheckMedicine}
            setPatientData={setPatientData}
            setTab={setTab}
          />
        ) : (
          <Tablenext
            patientData={patientData}
            inventoryData={inventoryData || []}
            recheckmedicine={recheckMedicine}
            setTab={setTab}
            cycleId={cycleId}
          />
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default RecheckMedicine;
