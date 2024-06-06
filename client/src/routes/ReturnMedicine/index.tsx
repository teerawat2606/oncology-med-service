import React from "react";
import { useState, useEffect } from "react";
import Table from "./Table";
import { cycleApi } from "../../api";
import { useParams } from "react-router";
import { UsageSummaryData } from "../../interfaces";

const ReturnMedicine = () => {
  const { cycleId } = useParams();
  const [usageSummaryData, setUsageSummaryData] = useState<UsageSummaryData>();

  useEffect(() => {
    const fetchData = async () => {
      const usageSummary = await cycleApi.getUsageSummary(Number(cycleId));
      setUsageSummaryData(usageSummary);
    };
    fetchData();
  }, [cycleId]);

  return (
    <div className="page-container">
      {usageSummaryData ? (
        <Table usageSummaryData={usageSummaryData} cycleId={cycleId} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ReturnMedicine;
