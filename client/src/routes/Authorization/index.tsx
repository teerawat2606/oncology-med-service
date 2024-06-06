import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import Unauthorized from "../../components/Unauthorized";
import { Role } from "../../enums";

interface Props {
  allowedRoles: Role[];
}

const Authorization: React.FC<Props> = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    const isAllowed = allowedRoles.includes(user.role);
    console.log(isAllowed);
    return isAllowed ? <Outlet /> : <Unauthorized />;
  }

  return <Navigate to="/login" state={{ path: location.pathname }} replace />;
};

export default Authorization;
