import { BACKEND_URL } from "..";

const login = async (username: string, password: string) =>
  fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
    // credentials: "include",
  });

const authApi = {
  login,
};

export default authApi;
