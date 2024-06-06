import React from "react";
import { useAuth } from "../../providers/AuthProvider";

interface Props {
  children: any;
}

const Authentication: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();

  return user ? children : <></>;
};

export default Authentication;
