import { useAuth } from "../../providers/AuthProvider";
import "./index.css";

const Header: React.FC = () => {
  const { user } = useAuth();

  return user ? (
    <div className="header-container">
      <div>
        <h1 className="user-info">{user.role}</h1>
        <h3 className="user-info">{user.name}</h3>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Header;
