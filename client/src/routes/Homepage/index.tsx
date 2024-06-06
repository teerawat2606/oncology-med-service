import "./index.css";

import NurseHomepage from "./NurseHomepage";
import { useAuth } from "../../providers/AuthProvider";
import DoctorHomepage from "./DoctorHomepage";
import InventoryHomepage from "./InventoryHomepage";
import PharmacyHomepage from "./PharmacyHomepage";
import { Role } from "../../enums";
import AdminHomepage from "./AdminHomepage";

const Homepage: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role;
  return user && role ? (
    role === Role.DOCTOR ? (
      <DoctorHomepage />
    ) : role === Role.NURSE ? (
      <NurseHomepage />
    ) : role === Role.INVENTORY ? (
      <InventoryHomepage />
    ) : role === Role.PHARMACY ? (
      <PharmacyHomepage />
    ) : role === Role.ADMIN ? (
      <AdminHomepage />
    ) : (
      <></>
    )
  ) : (
    <></>
  );
};

export default Homepage;
