import { BACKEND_URL } from "..";
import RecieveRegimenData from "../../interfaces/RecieveRegimenData";
import RecieveRegimenDetailData from "../../interfaces/RecieveRegimenDetailData";

const getRegimenInfo = async (): Promise<RecieveRegimenData[] | []> => {
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
    return [];
  }
};

const getRegimenDetailInfo = async (
  regimenId: number
): Promise<RecieveRegimenDetailData[] | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/regimen/${regimenId}`, {
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

const regimeninfo = {
  getRegimenInfo,
  getRegimenDetailInfo,
};

export default regimeninfo;
