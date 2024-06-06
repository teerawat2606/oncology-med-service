import { useEffect, useState } from "react";
import { inventory } from "../../api";
import Table from "./Table";

type InventoryType = {
  medicine: string;
  reserved: string;
  available: string;
  total: string;
};

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState<Array<InventoryType>>();

  useEffect(() => {
    const fetchData = async () => {
      setInventoryData(await inventory.getInventoryData());
    };
    fetchData();
  }, []);

  return (
    <div className="page-container">{inventoryData ? <Table /> : <></>}</div>
  );
};

export default Inventory;
