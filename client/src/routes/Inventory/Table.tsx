import React, { useEffect, useState } from "react";
import { drugApi } from "../../api"; // Assuming `medicine` is not used
import { Button, InputNumber, Modal, Popconfirm, message } from "antd";
import { useNavigate } from "react-router";
import { BottleInventory } from "../../interfaces";

const Table: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [medicineData, setMedicineData] = useState<BottleInventory[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<{ [key: string]: boolean }>({});
  const [inputValue, setInputValue] = useState<number | undefined>(0);
  const navigate = useNavigate();

  const handleModalOpen = (id: number) => {
    setModalOpen((prev) => ({ ...prev, [id]: true }));
  };

  const handleModalClose = (id: number) => {
    setModalOpen((prev) => ({ ...prev, [id]: false }));
  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOk = async (id: number) => {
    const idToEdit = id;
    try {
      const res = await drugApi.patchBottleInventory(idToEdit, inputValue);
      const result = await res.json();
      message.success("Price edited successfully");
      navigate("/inventory", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Error editing price:", error);
      message.error("Failed to edit price");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await drugApi.getInventory();
        console.log(res);
        if (res) {
          setMedicineData(res);
        } else {
          console.error("Response is undefined");
        }
      } catch (error) {
        console.error("Error fetching drug data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredMedicineData = medicineData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageHandler = (type: string) => {
    if (type === "minus" && page !== 1) {
      setPage((prevPage) => prevPage - 1);
    } else if (
      type === "add" &&
      filteredMedicineData &&
      page < Math.ceil(filteredMedicineData.length / 10)
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="table-containerrrr">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search bottle..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="cycle">
        <table className="medicineandregimentable">
          <thead>
            <tr className="medicineandregimenrow">
              <th className="medicineandregimenheader">Bottle Name</th>
              <th className="medicineandregimenheader">#Reserved</th>
              <th className="medicineandregimenheader">#Available</th>
              <th className="medicineandregimenheader">#Action</th>
              <th className="medicineandregimenheader">#Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicineData
              .slice(10 * page - 10, 10 * page)
              .map(({ id, name, inventory, reserved }) => (
                <tr className="medicineandregimenrow" key={id}>
                  <td className="medicineandregimenbody">{name}</td>
                  <td className="medicineandregimenbody">{reserved}</td>
                  <td className="medicineandregimenbody3">{inventory}</td>
                  <td className="medicineandregimenbody">
                    <Button
                      className="editbutton"
                      type="primary"
                      onClick={() => handleModalOpen(id)}
                    >
                      Edit
                    </Button>
                    <Modal
                      title="Edit inventory"
                      open={modalOpen[id]}
                      onOk={() => handleOk(id)}
                      onCancel={() => handleModalClose(id)}
                    >
                      <p>{`Edit inventory of ${name} to :`}</p>
                      <InputNumber
                        name="editprice"
                        value={inputValue}
                        onChange={(value) => setInputValue(value || undefined)}
                      />
                    </Modal>
                  </td>
                  <td className="medicineandregimenbody3">
                    {inventory + reserved}
                  </td>
                </tr>
              ))}
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
