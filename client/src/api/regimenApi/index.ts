import { BACKEND_URL } from "..";
import Regimen from "../../interfaces/Regimen";

const getRegimen = async (): Promise<Regimen[] | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/regimen`, {
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

const deleteRegimen = async (regimenId: number | undefined) => {
  return fetch(`${BACKEND_URL}/regimen/${regimenId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    // credentials: "include",
    body: JSON.stringify({
      regimenId,
    }),
  });
};
const postRegimen = async (
  name: string | undefined,
  note: string | undefined,
  remark: string | undefined,
  medication: string | undefined,
  premedication: string | undefined,
  homeMed: string | undefined,
  usages: {
    usage: string;
    formulas: {
      diluteDescription: string | undefined;
      drugId: number;
      formulaQuantity: number;
      formulaUnit: string;
    }[];
  }[]
) => {
  return fetch(`${BACKEND_URL}/regimen`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    // credentials: "include",
    body: JSON.stringify({
      name,
      note,
      remark,
      medication,
      premedication,
      homeMed,
      usages,
    }),
  });
};
const regimenApi = {
  getRegimen,
  postRegimen,
  deleteRegimen,
};

export default regimenApi;
