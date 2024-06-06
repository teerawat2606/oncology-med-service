import { Link, useLocation } from "react-router-dom";
import "./index.css";
import { Button } from "antd";
import { useAuth } from "../../providers/AuthProvider";
import { Logo } from "../UIComponent/Logo";
import { BACKEND_URL } from "../../api";
const linkArr = [
  {
    name: "Homepage",
    path: "/homepage",
  },
  {
    name: "All Patients",
    path: "/all-patient",
  },
  {
    name: "Inventory",
    path: "/inventory",
  },
  {
    name: "Medicine and Regimen",
    path: "/medicine-and-regimen",
  },
  {
    name: "Calendar",
    path: "/calendar",
  },
];

export default function Navigator() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    // await fetch(`${BACKEND_URL}/auth/logout`, {
    //   // credentials: "include",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    //   },
    // });
    logout();
  };

  return (
    <nav className="nav">
      <ul>
        <Logo className="logo" />
        {linkArr.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`nav-link ${
              pathname === link.path ? "nav-link-selected" : "nav-link-normal"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </ul>
      <Button className="logout" onClick={handleLogout}>
        Log out
      </Button>
    </nav>
  );
}
