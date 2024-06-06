import React, { useEffect, useState } from "react";
import "./TableReg.css";
import { drugApi, regimenApi } from "../../api"; // Assuming `medicine` is not used
import { Button, InputNumber, Modal, Popconfirm, message } from "antd";
import { useNavigate } from "react-router";
import { BottleInventory } from "../../interfaces";
import Regimen from "../../interfaces/Regimen";

const TableReg: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [regimenData, setRegimenData] = useState<Regimen[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const confirm = async (id: number) => {
    try {
      const res = await regimenApi.deleteRegimen(id);
      const result = await res.json();
      message.success("Regimen deleted successfully");
      navigate("/medicine-and-regimen", { replace: true });
    } catch (error) {
      console.error("Error deleting regimen:", error);
      message.error("Failed to delete regimen");
    }
  };

  const cancel = () => {
    message.error("Click on No");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await regimenApi.getRegimen();
        if (res) {
          setRegimenData(res);
        } else {
          console.error("Response is undefined");
        }
      } catch (error) {
        console.error("Error fetching drug data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredRegimenData = regimenData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageHandler = (type: string) => {
    if (type === "minus" && page !== 1) {
      setPage((prevPage) => prevPage - 1);
    } else if (
      type === "add" &&
      filteredRegimenData &&
      page < Math.ceil(filteredRegimenData.length / 10)
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="table-containerss">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search regimen..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="">
        <table className="medicineandregimentable">
          <thead>
            <tr className="medicineandregimenrow">
              <th className="medicineandregimenheader">Regimen</th>
              {/* <th className="medicineandregimenheader">List of Medicine</th>ç */}
              <th className="medicineandregimenheader">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegimenData
              .slice(10 * page - 10, 10 * page)
              .map(({ id, name, drugs }) => (
                <tr className="medicineandregimenrow" key={id}>
                  <td className="medicineandregimenbody">{name}</td>
                  {/* <td className="medicineandregimenbody">
                    {drugs.map((drug) => (
                      <div key={drug.id}>{drug.name}</div>
                    ))}
                  </td> */}
                  <td className="medicineandregimenbody3">
                    <Popconfirm
                      title="Delete the regimen"
                      description="Are you sure to delete this regimen?"
                      onConfirm={() => confirm(id)}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>Delete</Button>
                    </Popconfirm>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="pagess">
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

export default TableReg;
