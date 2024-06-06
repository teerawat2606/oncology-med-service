import { useEffect, useState } from "react";
import { patient } from "../../api";
import Table from "./Table";
import { Link } from "react-router-dom";
import Patient from "../../interfaces/Patient";
import "./index.css";

const AllPatient = () => {
  const [patientData, setPatientData] = useState<Patient[]>();

  useEffect(() => {
    const fetchData = async () => {
      setPatientData(await patient.getPatientData());
    };
    fetchData();
  }, []);

  return (
    <div className="page-container-allpateint">
      {patientData ? <Table patientData={patientData} /> : <></>}
    </div>
  );
};

export default AllPatient;
