import { useEffect, useState } from "react";
import "./index.css";
import Box from "./box";
import { medrequest } from "../../../api";

type MedRequest = {
  medicine: string;
  size: string;
  request: string;
  inventory: string;
};

const MedQuantity = () => {
  const [medRequestData, setMedRequestData] = useState<Array<MedRequest>>();

  useEffect(() => {
    const fetchData = async () => {
      setMedRequestData(await medrequest.getMedRequestData());
    };
    fetchData();
  }, []);

  return (
    <div className="page-container">
      {medRequestData ? <Box medRequestData={medRequestData} /> : <></>}
    </div>
  );
};

export default MedQuantity;
