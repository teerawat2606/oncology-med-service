import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import TableMed from "./TableMed";
import TableReg from "./TableReg";

const Header: React.FC = () => {
  const [tab, setTab] = useState<string>(() => {
    const storedTab = localStorage.getItem("currentTab");
    return storedTab ? storedTab : "reg";
  });

  const handleRegClick = () => {
    setTab("reg");
  };

  const handleMedClick = () => {
    setTab("med");
  };

  useEffect(() => {
    localStorage.setItem("currentTab", tab);
  }, [tab]);

  return (
    <>
      <div className="tabtab">
        <div className="status-tab">
          <button
            className="to-do"
            style={{
              backgroundColor: tab === "reg" ? "#06264e" : "white",
              color: tab === "reg" ? "white" : "#06264e",
            }}
            onClick={handleRegClick}
          >
            {" "}
            All Regimen
          </button>
          <button
            className="waiting"
            style={{
              backgroundColor: tab === "med" ? "#06264e" : "white",
              color: tab === "med" ? "white" : "#06264e",
            }}
            onClick={handleMedClick}
          >
            {" "}
            All Medicine
          </button>
        </div>

        <div className="ccon">
          <Link to="/add-reg">
            <button
              className="add-reg"
              style={{
                backgroundColor: "#cc0001",
                color: "white",
                textDecoration: "none",
              }}
            >
              Add Regimen
            </button>
          </Link>
        </div>

        <div className="ccon">
          <Link to="/add-med">
            <button
              className="add-med"
              style={{
                backgroundColor: "#cc0001",
                color: "white",
                textDecoration: "none",
              }}
            >
              {" "}
              Add Medicine
            </button>
          </Link>
        </div>
      </div>

      {tab === "med" ? <TableMed /> : <TableReg />}
    </>
  );
};

export default Header;
