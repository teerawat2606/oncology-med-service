import "./index.css";

import { useNavigate } from "react-router-dom";

interface Props {
  actions: { name: string; path: string }[];
}

const ActionList: React.FC<Props> = ({ actions }) => {
  const navigate = useNavigate();

  const handleActionClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="action-list">
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={() => handleActionClick(action.path)}
          className="action-button"
        >
          {action.name}
        </button>
      ))}
    </div>
  );
};

export default ActionList;
