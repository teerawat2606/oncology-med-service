import { BACKEND_URL } from "..";

import BottleInventory from "../../interfaces/BottleInventory";
import { DrugData } from "../../routes/MedAndRegPage/add-med/existedmedicine";

const getAllDrugs = async (): Promise<string[] | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/drug/name`, {
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
const getDrugInfo = async (): Promise<DrugData[] | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/drug`, {
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
const getBottle = async (): Promise<BottleInventory[] | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/bottle/cost`, {
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
const getInventory = async (): Promise<BottleInventory[] | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/bottle/inventory`, {
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
const postBottle = async (
  drugId: number | undefined,
  name: string | undefined,
  cost: number | undefined
) => {
  return fetch(`${BACKEND_URL}/bottle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    // credentials: "include",
    body: JSON.stringify({
      drugId,
      name,
      cost,
    }),
  });
};
const deleteBottle = async (bottleId: number | undefined) => {
  return fetch(`${BACKEND_URL}/bottle/${bottleId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    // credentials: "include",
    body: JSON.stringify({
      bottleId,
    }),
  });
};

const postDrug = async (drugName: string | undefined) => {
  return fetch(`${BACKEND_URL}/drug`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    // credentials: "include",
    body: JSON.stringify({
      name: drugName,
    }),
  });
};
const patchBottleInventory = async (
  bottleId: number | undefined,
  inventory: number | undefined
) => {
  console.log(bottleId);
  return fetch(`${BACKEND_URL}/bottle/${bottleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({
      inventory,
    }),
    // credentials: "include",
  });
};

const patchBottlePrice = async (
  bottleId: number | undefined,
  cost: number | undefined
) => {
  return fetch(`${BACKEND_URL}/bottle/${bottleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({
      cost,
    }),
    // credentials: "include",
  });
};
const drugApi = {
  getAllDrugs,
  getDrugInfo,
  postBottle,
  postDrug,
  deleteBottle,
  getBottle,
  patchBottlePrice,
  getInventory,
  patchBottleInventory,
};

export default drugApi;
