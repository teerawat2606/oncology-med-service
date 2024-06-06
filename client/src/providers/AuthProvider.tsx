import React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api";
import { User } from "../interfaces";

interface Props {
  children: any;
}

const AuthContext = createContext<{
  user: User | undefined;
  login: () => Promise<void>;
  logout: () => void;
}>({
  user: undefined,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();

  const fetchUserInfo = useCallback(async () => {
    console.log("AuthProvider: fetching user...");
    try {
      const res = await userApi.getUserInfo();
      const fetchedUser = await res.json();

      if (fetchedUser.statusCode === 401) {
        setUser(undefined);
        navigate("/login", { replace: true });
        throw Error(fetchedUser.message);
      }

      setUser(fetchedUser);
    } catch (err) {
      console.log(err);
    }
  }, []);

  // fetch user info on refresh
  useEffect(() => {
    if (!user) fetchUserInfo();
  }, [fetchUserInfo, user]);

  const login = async () => {
    fetchUserInfo();
  };

  const logout = () => {
    setUser(undefined);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
