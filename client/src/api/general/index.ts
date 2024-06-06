import { BACKEND_URL } from "..";
import { TableName } from "../../enums";

const getTableData = async (tableName: TableName): Promise<any[]> => {
  const res = await fetch(`${BACKEND_URL}/data/${tableName}`, {
    // credentials: "include",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  return res.json();
};

const generalApi = {
  getTableData,
};

export default generalApi;
