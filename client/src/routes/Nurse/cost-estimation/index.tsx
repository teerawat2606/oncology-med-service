import "./index.css";
import Box from "./box";
import { MedRequestInputType } from "../med-quantity/box";

type CostEstimationProps = {
  name: string;
  setName: (name: string) => void;
  wbc: number | null;
  setWbc: (name: number | null) => void;
  btc: number | null;
  setBtc: (name: number | null) => void;
  pmc: number | null;
  setPmc: (name: number | null) => void;
  thc: number | null;
  setThc: (name: number | null) => void;
  dtc: number | null;
  setDtc: (name: number | null) => void;
  emc: number | null;
  setEmc: (name: number | null) => void;
  data: MedRequestInputType;
};

const CostEstimation: React.FC<CostEstimationProps> = ({
  name,
  setName,
  wbc,
  pmc,
  thc,
  dtc,
  emc,
  btc,
  setBtc,
  setPmc,
  setThc,
  setDtc,
  setEmc,
  setWbc,
  data,
}) => {
  return (
    // <div className="page-container">
    <Box
      name={name}
      setName={setName}
      btc={btc}
      setBtc={setBtc}
      pmc={pmc}
      setPmc={setPmc}
      thc={thc}
      setThc={setThc}
      dtc={dtc}
      setDtc={setDtc}
      emc={emc}
      setEmc={setEmc}
      wbc={wbc}
      setWbc={setWbc}
      data={data}
    />
    // </div>
  );
};

export default CostEstimation;

// bloodtestcost,
// premedcost,
// takehomecost,
// doctorcost,
// equipmentcost,
// whitebloodcost,
