import { BACKEND_URL } from "..";
import RecieveCycleData from "../../interfaces/RecieveCycleData";

const getCycleInfo = async (
  cycleId: number
): Promise<RecieveCycleData | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/cycle/open/${cycleId}`, {
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

export default getCycleInfo;
