import { useState } from "react";
import "./Table.css";
import Patient from "../../interfaces/Patient";
import { useNavigate } from "react-router";

interface Props {
  patientData: Array<Patient>;
}

const Table: React.FC<Props> = ({ patientData }) => {
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const pageHandler = (type: string) => {
    if (type === "minus" && page !== 1) {
      setPage(page - 1);
    } else if (type === "add" && page < Math.ceil(filteredData.length / 12)) {
      setPage(page + 1);
    } else setPage(page);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setPage(1); // Reset page when searching
  };

  const filteredData = patientData.filter(
    (patient) =>
      patient.HN.toString().includes(searchQuery) ||
      patient.name.toLowerCase().includes(searchQuery) ||
      patient.cases.some((caseItem) =>
        // caseItem.regimenName.toLowerCase().includes(searchQuery) ||
        caseItem.doctorName.toLowerCase().includes(searchQuery)
      )
  );

  return (
    <div className="table-containerrrr">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by HN, name, regimen, or doctor..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="case">
        <table className="allpatienttable">
          <thead>
            <tr className="allpatientrow">
              <th className="allpatientheader">HN Number</th>
              <th className="allpatientheader">Patient Name</th>
              <th className="allpatientheader">Regimen</th>
              <th className="allpatientheader">Doctor</th>
            </tr>
          </thead>
          <tbody>
            {filteredData
              .slice(12 * page - 12, 12 * page)
              .map(({ HN, name, cases }, index) =>
                cases.map((caseItem, caseIndex) => (
                  <tr
                    className="allpatientrow"
                    key={index + caseIndex}
                    onClick={() => navigate(`/allcycle/${caseItem.id}`)}
                  >
                    <td className="allpatientbody">{HN}</td>
                    <td className="allpatientbody">{name}</td>
                    <td className="allpatientbody">{caseItem.regimenName}</td>
                    <td className="allpatientbody">{caseItem.doctorName}</td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
        <div className="page">
          <button
            onClick={() => pageHandler("minus")}
            style={{ backgroundColor: "white" }}
          >
            {"<"}
          </button>
          <p>{page}</p>
          <button
            onClick={() => pageHandler("add")}
            style={{ backgroundColor: "white" }}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
