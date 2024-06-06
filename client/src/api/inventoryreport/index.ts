import { BACKEND_URL } from "..";
import InventoryReport from "../../interfaces/InventoryReport";

const getInventoryReport = async (
  cycleId: number
): Promise<InventoryReport | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/cycle/drug-summary/${cycleId}`, {
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

export default getInventoryReport;
