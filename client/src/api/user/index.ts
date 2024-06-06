import { BACKEND_URL } from "..";
import { AllUser } from "../../interfaces/AllUser";
import { DoctorData } from "../../routes/opencycle/box";

const getUserInfo = async () =>
  fetch(`${BACKEND_URL}/user/user-info`, {
    // credentials: "include",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

const getAllUser = async (): Promise<AllUser[] | undefined> => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/user?offset=0&limit=-1
      `,
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

const deleteUser = async (userId: number | undefined) => {
  return fetch(`${BACKEND_URL}/user/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    // credentials: "include",
    body: JSON.stringify({
      userId,
    }),
  });
};

const getDoctorInfo = async (): Promise<DoctorData[] | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}/user/doctor`, {
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

const userApi = {
  getUserInfo,
  getDoctorInfo,
  getAllUser,
  deleteUser,
};

export default userApi;
