import React from "react";

interface Props {
  name: string;
  role: string;
}

const Header: React.FC<Props> = ({ name, role }) => {
  return (
    <div className="top-container">
      <div>
        <h1 className="user"> {role}</h1>
        <h3 className="user">{name}</h3>{" "}
      </div>
    </div>
  );
};

export default Header;