import { BACKEND_URL } from "..";
import CycleByMonth from "../../interfaces/CycleByMonth";

const getCycleByMonth = async (
  month: any,
  year: any
): Promise<CycleByMonth[] | undefined> => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/cycle/by-month?month=${month}&year=${year}`,
      {
        // credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const calendarApi = {
  getCycleByMonth,
};
export default calendarApi;
