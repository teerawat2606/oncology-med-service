import React, { useState } from "react";
import { Form, Link } from "react-router-dom";
import "./index.css";
import { Switch } from "antd";
import AddNewMedicine from "./newmedicine";
import AddBottle from "./existedmedicine";

function AddMed() {
  const [checked, setChecked] = useState(false);
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
    setChecked((prevCheck) => !prevCheck);
  };
  return (
    <div className="page-container">
      <div className="table-container-addmed">
        <h2 className="headhead">Add medicine</h2>
        {`new medicine : `}
        <Switch onChange={onChange} />

        {checked ? <AddNewMedicine /> : <AddBottle />}
      </div>
    </div>
  );
}

export default AddMed;
