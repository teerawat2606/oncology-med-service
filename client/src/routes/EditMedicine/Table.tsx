import React from "react";
import "./Table.css";
import { Link } from "react-router-dom";

interface Props {
  patientData: Array<PatientData>;
  usagesummaryData: Array<UsageSummaryData>;
}

interface PatientData {
  cyclenumber: string;
  HN: string;
  patientname: string;
  regimen: string;
  doctor: string;
}

interface UsageSummaryData {
  medicine: string;
  size: string;
  request: string;
}

const Table: React.FC<Props> = ({ patientData, usagesummaryData }) => {
  const filteredPatients = patientData.filter(
    (patient) => patient.cyclenumber === "00000001"
  );

  return (
    <div className="table-container">
      <div className="cycle1">
        {filteredPatients.map((patient, index) => (
          <div key={index} className="editmedicineheading">
            <div>
              <h1>New Medicine Request</h1>
            </div>
            <div className="patientcard">
              <p>
                {patient.patientname} {"("}
                {patient.HN}
                {")"}
              </p>
              <p>{patient.doctor}</p>
              <p>regimen : {patient.regimen}</p>
            </div>
          </div>
        ))}
      </div>
      <table className="usagesummary">
        <thead className="heading">
          <tr>
            <td className="usagesummaryheader">List of Medicine</td>
            <td className="usagesummaryheaderrequest">Request</td>
          </tr>
        </thead>
        <tbody>
          {usagesummaryData.map(({ medicine, size, request }, index) => (
            <tr key={index}>
              <td>
                <div className="medicine">
                  <p>{medicine}</p>
                  <p className="size">{size}</p>
                </div>
              </td>
              <td className="request">{request}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="allusagesummarybutton">
        <div className="usagesummarybutton1">
          <Link className="usagesummarybutton" to="/homepage">
            Back
          </Link>
        </div>
        <div className="usagesummarybutton1">
          <Link className="usagesummarybutton" to="/recheckmedicine">
            Create
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Table;
