import "./index.css";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import { NavyButton } from "../../../components/UIComponent/Button/CustomButton";
import { Form, Input } from "antd";
import { TaskType } from "../../../enums";
import { ShortCycle } from "../../../interfaces";
import CycleCard from "./CycleCard";
import { cycleApi } from "../../../api";

interface Props {
  taskType?: TaskType;
}

const CycleList: React.FC<Props> = ({ taskType }) => {
  const [cycleList, setCycleList] = useState<ShortCycle[]>([]);
  const [filteredCycleList, setFilteredCycleList] = useState<ShortCycle[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, taskType]);

  const fetchData = async () => {
    // Fetch all cycles initially
    const cycles = await cycleApi.getShortCycles(taskType);
    setCycleList(cycles ? cycles : []);
    // Set filtered cycle list to all cycles initially
    setFilteredCycleList(cycles ? cycles : []);
  };

  const handleSearch = (searchQuery: string) => {
    // Filter cycle list based on search query
    const filteredCycles = cycleList.filter((cycle) =>
      cycle.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCycleList(filteredCycles);
  };

  const onFinish = (values: { searchQuery?: string }) => {
    if (values.searchQuery) {
      handleSearch(values.searchQuery);
    } else {
      // If search query is empty, show all cycles
      setFilteredCycleList(cycleList);
    }
  };

  return (
    <div className="cycle-list-container">
      <Form onFinish={onFinish} className="search-bar">
        <Form.Item name="searchQuery" className="cycle-search-input">
          <Input placeholder="Search by patient name" />
        </Form.Item>
        <Form.Item className="cycle-search-button">
          <NavyButton htmlType="submit">Search</NavyButton>
        </Form.Item>
      </Form>
      <div className="cycle-list">
        {filteredCycleList.map((shortCycle, index) => (
          <CycleCard shortCycle={shortCycle} index={index} />
        ))}
      </div>
    </div>
  );
};

export default CycleList;
