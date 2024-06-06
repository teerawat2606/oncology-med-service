import { BACKEND_URL } from "..";
import { TaskType } from "../../enums";
import { Inventory, RecheckMedicineData, ShortCycle } from "../../interfaces";
import AllCycleByCase from "../../interfaces/AllCycleByCase";
import { Appointment } from "../../interfaces/appointment";
import { Drug as DrugWithBottles } from "../../interfaces/Bottles";
import ICheck from "../../interfaces/check";
import CheckCost from "../../interfaces/checkcost";
import CostSummary from "../../interfaces/cost.summary";
import CycleDetails from "../../interfaces/CycleDetails";
import RecieveMedicineData from "../../interfaces/RecieveMedicineData";
import UsageSummary from "../../interfaces/UsageSummaryData";
import { CycleSummary } from "../../interfaces/CycleSummary";

const patchCycleSummary = async (cycleId: number, body: CycleSummary) => {
  console.log(body);
  try {
    const res = await fetch(`${BACKEND_URL}/cycle/open/${cycleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(body),
      // credentials: "include",
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const getShortCycles = async (
  taskType?: TaskType,
  searchQuery?: string
): Promise<ShortCycle[] | undefined> => {
  try {
    const searchParams = new URLSearchParams();
    if (taskType) {
      searchParams.append("taskType", taskType);
    }
    if (searchQuery) {
      searchParams.append("searchQuery", searchQuery);
    }
    const res = await fetch(
      `${BACKEND_URL}/cycle/short?${searchParams.toString()}`,
      {
        // credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    if (res.status === 200) return res.json();
    else return undefined;
  } catch (err) {
    console.log(err);
  }
};

const getAllCycle = async (
  caseId: number
): Promise<AllCycleByCase[] | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/cycle/by-case/${caseId}`, {
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

const getUsageSummary = async (
  cycleId: number
): Promise<UsageSummary | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/cycle/ready/${cycleId}`, {
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
const getInventory = async (
  cycleId: number
): Promise<Inventory | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/cycle/inventory/${cycleId}`, {
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
const getRecieveMedicine = async (
  cycleId: number
): Promise<RecieveMedicineData | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/cycle/return/${cycleId}`, {
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
const getBottlesInventory = async (
  param: string
): Promise<DrugWithBottles[] | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/drug/bottles?drugIds=${param}`, {
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
const getRecheckMedicine = async (
  cycleId: number
): Promise<RecheckMedicineData | undefined> => {
  try {
    console.log(`${BACKEND_URL}/cycle/pharmacy/${cycleId}`);
    const res = await fetch(`${BACKEND_URL}/cycle/pharmacy/${cycleId}`, {
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

const getCycleDetails = async (
  cycleId: number
): Promise<CycleDetails | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/cycle/detail/${cycleId}`, {
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

const patchUsageSummary = async (
  cycleId: string | undefined,
  bottles:
    | {
        id: number | undefined;
        return: number | undefined;
      }[]
    | undefined
) => {
  console.log(bottles);
  return fetch(`${BACKEND_URL}/cycle/ready/${cycleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({
      bottles,
    }),
    // credentials: "include",
  });
};
const patchInventory = async (
  cycleId: string | undefined,
  inventoryPRnumber: number | undefined,
  inventoryPRdate: Date | undefined,
  bottlePurchases:
    | [
        {
          id: number | undefined;
          purchase: number | undefined;
        }
      ]
    | undefined,
  inventoryNote: string | undefined
) => {
  console.log(bottlePurchases);
  return fetch(`${BACKEND_URL}/cycle/inventory/${cycleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({
      inventoryPRnumber,
      inventoryPRdate,
      bottlePurchases,
      inventoryNote,
    }),
    // credentials: "include",
  });
};
const patchRecieveMedicine = async (
  cycleId: string | undefined,
  bottles:
    | {
        id: number | undefined;
        return: number | undefined;
      }[]
    | undefined
) => {
  console.log(bottles);
  return fetch(`${BACKEND_URL}/cycle/return/${cycleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({
      bottles,
    }),
    // credentials: "include",
  });
};
const patchRecheckMedicine = async (
  cycleId: string | undefined,
  formulas:
    | {
        id: number;
        quantity: number | undefined;
        location: string | undefined;
      }[]
    | undefined,
  bottles:
    | {
        id: number | undefined;
        quantity: number | undefined;
      }[]
    | undefined,
  pharmacyNote?: string
) => {
  console.log(formulas);
  console.log(bottles);
  return fetch(`${BACKEND_URL}/cycle/pharmacy/${cycleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({
      pharmacyNote,
      formulas,
      bottles,
    }),
    // credentials: "include",
  });
};

const patchReschedule = async (
  cycleId: string | undefined,
  appointmentDate: string | undefined
) => {
  return fetch(`${BACKEND_URL}/cycle/re-schedule/${cycleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({
      newAppointmentDate: appointmentDate,
    }),
    // credentials: "include",
  });
};
const cancelCycle = async (cycleId: number | undefined) => {
  return fetch(`${BACKEND_URL}/cycle/cancel/${cycleId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    // credentials: "include",
    body: JSON.stringify({
      cycleId,
    }),
  });
};
const deleteCycle = async (cycleId: number | undefined) => {
  return fetch(`${BACKEND_URL}/cycle/${cycleId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    // credentials: "include",
    body: JSON.stringify({
      cycleId,
    }),
  });
};

const postNewCycle = async (
  caseId: number,
  newPatientMeasurements: {
    age: number | undefined;
    Ht: number | undefined;
    BW: number | undefined;
    sCr: number | undefined;
  }
) => {
  return fetch(`${BACKEND_URL}/cycle/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    // credentials: "include",
    body: JSON.stringify({
      caseId,
      newPatientMeasurements,
    }),
  });
};

const getAppointment = async (
  cycleId: number
): Promise<Appointment | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/cycle/appointment/${cycleId}`, {
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

const makeAppointment = async (
  appointmentDate: Date,
  cycleId: number
): Promise<ShortCycle | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/cycle/appointment/${cycleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        appointmentDate,
      }),
      // credentials: "include",
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const getCostSummary = async (
  cycleId: number
): Promise<CostSummary | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/cycle/cost-summary/${cycleId}`, {
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

const getCycleOPD = async (cycleId: number): Promise<ICheck | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/cycle/check/${cycleId}`, {
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

const patchCheckCost = async (cycleId: number, body: CheckCost) => {
  try {
    const res = await fetch(`${BACKEND_URL}/cycle/check/${cycleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(body),
      // credentials: "include",
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

// cycle is a reserved keyword
const cycleApi = {
  getShortCycles,
  getUsageSummary,
  getRecheckMedicine,
  patchRecheckMedicine,
  getBottlesInventory,
  patchUsageSummary,
  getRecieveMedicine,
  patchRecieveMedicine,
  getInventory,
  patchInventory,
  getAllCycle,
  getCycleDetails,
  deleteCycle,
  cancelCycle,
  postNewCycle,
  patchReschedule,
  getAppointment,
  makeAppointment,
  getCostSummary,
  getCycleOPD,
  patchCheckCost,
  patchCycleSummary,
};

export default cycleApi;
