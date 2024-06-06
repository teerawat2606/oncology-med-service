import { Link } from "react-router-dom";
import { ShortCycle } from "../../../interfaces";
import { CycleStatus } from "../../../enums";

interface Props {
  shortCycle: ShortCycle;
  index: number;
}

const STATUS_TO_PATH: Record<CycleStatus, string> = {
  [CycleStatus.OPEN]: "/cycleoverview",
  [CycleStatus.CHECK]: "/medquantity",
  [CycleStatus.PHARMACY]: "/recheckmedicine",
  [CycleStatus.INVENTORY]: "/order-medicine", // to add
  [CycleStatus.ORDER]: "/medicine-summary", // to add
  [CycleStatus.READY]: "/usage-summary",
  [CycleStatus.RETURN]: "/recieve-medicine",
  [CycleStatus.APPOINTMENT]: "/appointment",
  [CycleStatus.COMPLETE]: "",
  [CycleStatus.CANCEL]: "",
  [CycleStatus.CASE_SUMMARY_REPORT]: "",
};

const CycleCard: React.FC<Props> = ({ shortCycle, index }) => {
  return (
    <Link
      key={index}
      to={`${STATUS_TO_PATH[shortCycle.status]}/${shortCycle.id}`}
      className="cycle-card"
    >
      <div>
        <div className="cycle-title">
          <h3>{shortCycle.patientName}</h3>
          <h4 className="patient-hn">{`(HN ${shortCycle.patientHN})`}</h4>
        </div>
        <div>
          <h4 className="doctor-name">{shortCycle.doctorName}</h4>
          {shortCycle.regimenName ? (
            <h4 className="cycle-card-regimen">{`Regimen: ${shortCycle.regimenName}`}</h4>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div>
        <h5 className="cycle-status">{shortCycle.status}</h5>
      </div>
    </Link>
  );
};

export default CycleCard;
