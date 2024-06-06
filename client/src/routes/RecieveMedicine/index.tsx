import React from "react";
import { useState, useEffect } from "react";
import Table from "./Table";
import { cycleApi } from "../../api";
import { useParams } from "react-router";
import { RecieveMedicineData } from "../../interfaces";

const RecieveMedicine = () => {
  const { cycleId } = useParams();
  const [recieveMedicineData, setRecieveMedicineData] =
    useState<RecieveMedicineData>();

  useEffect(() => {
    const fetchData = async () => {
      const recieveMedicine = await cycleApi.getRecieveMedicine(
        Number(cycleId)
      );
      setRecieveMedicineData(recieveMedicine);
    };
    fetchData();
  }, [cycleId]);

  return (
    <div className="page-container">
      {recieveMedicineData ? (
        <Table recieveMedicineData={recieveMedicineData} cycleId={cycleId} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default RecieveMedicine;
