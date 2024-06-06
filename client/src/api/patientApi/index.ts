import { BACKEND_URL } from "..";
import Patient from "../../interfaces/Patient";

const postPatientData = async (
  doctorId: number,
  HN: number,
  name: string,
  gender: string,
  age: number,
  BW: number,
  Ht: number,
  sCr: number
) =>
  fetch(`${BACKEND_URL}/case/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({
      doctorId,
      patient: {
        HN,
        name,
        gender,
        age,
        BW,
        Ht,
        sCr,
      },
    }),
    // credentials: "include",
  });

const getPatientData = async (): Promise<Patient[] | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/patient`, {
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

const patient = {
  getPatientData,
  postPatientData,
};

export default patient;
