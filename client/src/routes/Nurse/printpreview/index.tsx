import "./index.css";
import Box from "./box";
import { MedRequestInputType } from "../med-quantity/box";
// import Box from "./box";

type NameProps = {
  name: string;
  wbc: number | null;
  btc: number | null;
  pmc: number | null;
  thc: number | null;
  dtc: number | null;
  emc: number | null;
  meddata: MedRequestInputType;
};
const PrintPreview: React.FC<NameProps> = ({
  name,
  wbc,
  btc,
  pmc,
  thc,
  dtc,
  emc,
  meddata,
}) => {
  return (
    // <div className="page-container">
    <Box
      name={name}
      wbc={wbc}
      btc={btc}
      pmc={pmc}
      thc={thc}
      dtc={dtc}
      emc={emc}
      meddata={meddata}
    />
    // </div>
  );
};

export default PrintPreview;
