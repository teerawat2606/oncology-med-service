import { useEffect, useState } from "react";
import "./box.css";
import {
  Outlet,
  Link,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
import { Button, Input, InputNumber } from "antd";
import CostEstimation from "../cost-estimation";
import PrintPreview from "../printpreview";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { cycleApi } from "../../../api";
import ICheck from "../../../interfaces/check";
import { Drug } from "../../../interfaces/Bottles";
import { IDrugSummaryBottles } from "../../../interfaces/drug.summary";

// import AddBottleSize from "../../MedAndRegPage/add-bottle-size";

const linkArr = [
  {
    name: "Back",
    path: "/backtohome",
  },
  {
    name: "Cost Verification",
    path: "/costverification",
  },
];

interface Props {
  medRequestData: Array<MedRequestData>;
}

interface MedRequestData {
  medicine: string;
  size: string;
  request: string;
  inventory: string;
}

type RecheckMedicine = {
  formulaId: number;
  drugName: string;
  drugId: number;
  formulaQuantity: number;
  formulaUnit: string;
  doctorAmount: number;
  formulaAmount: number;
  difference: number;
  pharmacyAmount?: number;
  location?: string;
};
export type MedRequestInputType = {
  [name: string]: {
    quantity: number;
    bottles: {
      id: number;
      name: string;
      cost: number;
      quantity: number;
      inventory: number;
    }[];
  };
};

const onChange = (value: number) => {
  console.log("changed", value);
};

const Box: React.FC<Props> = ({ medRequestData }) => {
  const { cycleId } = useParams();
  const { pathname } = useLocation();
  const [drugBottles, setDrugBottles] = useState<IDrugSummaryBottles[]>();
  const [OPDCard, setOPDCard] = useState<ICheck>();
  const [OPDCardDrugs, setOPDCardDrugs] = useState<MedRequestInputType>({});
  const [recheckMedicine, setRecheckMedicine] = useState<RecheckMedicine[]>();

  console.log(pathname);
  // use this one !!!!!
  useEffect(() => {
    const fetchData = async () => {
      if (cycleId) {
        try {
          const OPDSummary = await cycleApi.getCycleOPD(+cycleId);
          if (OPDSummary != null) {
            const mappedData: MedRequestInputType = OPDSummary.drugs.reduce(
              (acc, item) => {
                const bottleData = item.bottles.map((bottle) => ({
                  id: bottle.id,
                  name: bottle.name,
                  cost: bottle.cost,
                  quantity: bottle.quantity ?? 0,
                  inventory: bottle.inventory,
                }));

                acc[item.name] = {
                  quantity: item.quantity,
                  bottles: bottleData,
                };
                return acc;
              },
              {} as MedRequestInputType
            );

            setOPDCardDrugs(mappedData);
            setOPDCard(OPDSummary);
            const allRecheckMedicineData = await cycleApi.getRecheckMedicine(
              Number(cycleId)
            );
            setRecheckMedicine(
              allRecheckMedicineData &&
                allRecheckMedicineData.formulas.map((formula, index) => {
                  const {
                    id,
                    doctorQuantity,
                    computedFormulaQuantity,
                    diff,
                    drug,
                    ...rest
                  } = formula;
                  return {
                    formulaId: id,
                    doctorAmount: doctorQuantity,
                    formulaAmount: computedFormulaQuantity,
                    difference: diff,
                    drugName: drug.name,
                    drugId: drug.id,
                    ...rest,
                  };
                })
            );
            console.log(recheckMedicine);
          }
        } catch (error) {
          console.error("Error fetching OPD data:", error);
        }
      }
    };

    fetchData();
  }, [cycleId]);

  console.log(OPDCard);

  const calculateTotalDoctorAmount = (name: string) => {
    const filteredMedicineEntries = recheckMedicine?.filter(
      (entry) => entry.drugName === name
    );
    const totalDoctorAmount = filteredMedicineEntries?.reduce(
      (sum, entry) => sum + (entry.doctorAmount || 0),
      0
    );
    console.log(name, totalDoctorAmount, filteredMedicineEntries);
    return totalDoctorAmount;
  };

  const param = OPDCard?.drugs?.map((drug) => drug.id).join(",");
  // recheckmedicine = [{drugId: 1}, {drugId: 3}]
  // recheckmedicine?.map((drug) => drug.drugId) => [1, 3]
  // recheckmedicine?.map((drug) => drug.drugId).join(",") => 1,3
  const [drugs, setDrugs] = useState<MedRequestInputType>({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log(param);
    if (param) {
      const fetchData = async () => {
        console.log(param);
        const allDrugs = await cycleApi.getBottlesInventory(param);
        if (allDrugs) {
          const mappedData: MedRequestInputType = allDrugs.reduce(
            (acc, item: Drug) => {
              const bottleData = item.bottles.map((bottle) => ({
                id: bottle.id,
                name: bottle.name,
                cost: bottle.cost,
                quantity: bottle.quantity ?? 0,
                inventory: bottle.inventory,
              }));
              // Find the corresponding drug info for the current item
              const drugInfo = OPDCard?.drugs.find(({ id }) => id === item.id);
              // If drugInfo is found, use its name and quantity, otherwise use defaults
              const drugName = drugInfo?.name ?? "Unknown";
              const drugQuantity = drugInfo?.quantity ?? 0;
              acc[drugName] = {
                quantity: drugQuantity,
                bottles: bottleData,
              };
              return acc;
            },
            {} as MedRequestInputType
          );

          setDrugs(mappedData);
          console.log(drugs);
        }
      };
      fetchData();
    }
  }, [param]);

  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    if (OPDCard?.isInsurance) setIsChecked(true);
    else setIsChecked(false);
  }, [OPDCard]);

  const checkHandler = () => {
    setIsChecked(!isChecked);
  };

  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  // Event handler for the button click
  const handleButtonClick = () => {
    // Toggle the visibility state
    setIsContentVisible(!isContentVisible);
  };

  const handlePrintPreview = () => {
    // Toggle the visibility state
    setIsPreviewVisible(!isPreviewVisible);
  };

  const [name, setName] = useState("");
  const [btc, setBtc] = useState<number | null>(0);
  const [pmc, setPmc] = useState<number | null>(0);
  const [thc, setThc] = useState<number | null>(0);
  const [dtc, setDtc] = useState<number | null>(0);
  const [emc, setEmc] = useState<number | null>(0);
  const [wbc, setWbc] = useState<number | null>(0);

  const handleOnChangeNumber = (
    identifierKey: string,
    bottleNumber: number,
    enteredValue: number
  ) => {
    setDrugs((curInputValue: MedRequestInputType) => {
      const updatedInputValue = { ...curInputValue };
      updatedInputValue[identifierKey].bottles[bottleNumber] = {
        ...updatedInputValue[identifierKey].bottles[bottleNumber],
        quantity: enteredValue,
      };
      return updatedInputValue;
    });
  };

  const handleCostUpdate = async () => {
    if (cycleId && wbc && thc && emc && dtc && btc && pmc)
      try {
        const newDrugs = isChecked ? OPDCardDrugs : drugs;

        const res = await cycleApi.patchCheckCost(+cycleId, {
          bottles: Object.values(newDrugs)
            .flatMap(({ bottles }) => bottles)
            .map(({ id, quantity }) => ({ id, quantity }))
            .filter(({ quantity }) => quantity > 0),
          WBCmedAddinfo: name,
          WBCmedCost: wbc,
          takehomeMedCost: thc,
          doctorEquipmentCost: emc,
          doctorExpertiseCost: dtc,
          bloodTestCost: btc,
          premedCost: pmc,
        });
        console.log({
          bottles: Object.values(newDrugs)
            .flatMap(({ bottles }) => bottles)
            .map(({ id, quantity }) => ({ id, quantity }))
            .filter(({ quantity }) => quantity > 0),
          WBCmedAddinfo: name,
          WBCmedCost: wbc,
          takehomeMedCost: thc,
          doctorEquipmentCost: emc,
          doctorExpertiseCost: dtc,
          bloodTestCost: btc,
          premedCost: pmc,
        });
        // const result = await res.json();
        // res.json ทำใน cycleAPI ไปละ
        navigate("/homepage", { replace: true });

        // console.log("Success:", result);
      } catch (error) {
        console.error("Error:", error);
      }
  };

  return (
    <>
      {isPreviewVisible ? (
        <div className="table-container-mq">
          <div className="opd-card-container">
            {OPDCard && (
              <>
                <div className="textarea-container">
                  <TextArea
                    className="text-area"
                    defaultValue={`
Regimen: ${OPDCard.regimenName}

cycle number: ${OPDCard.cycleNumber}
                
Pre-medication:
${
  OPDCard.preMedication !== null && OPDCard.preMedication !== undefined
    ? OPDCard.preMedication
    : "none"
}
  
Chemotherapy:
${
  OPDCard.drugs &&
  OPDCard.drugs.map((drug) => {
    return drug.name;
  })
} ${
                      OPDCard.drugs &&
                      OPDCard.drugs.map((drug) => {
                        return drug.quantity;
                      })
                    } mg
                `}
                    rows={20}
                    cols={20}
                  />
                  <TextArea
                    className="text-area"
                    defaultValue={`
Remark:
${
  OPDCard.regimenRemark !== null && OPDCard.regimenRemark !== undefined
    ? OPDCard.regimenRemark
    : "none"
}
                
Medication:
${
  OPDCard.regimenMedication !== null && OPDCard.regimenMedication !== undefined
    ? OPDCard.regimenMedication
    : "none"
}

Home-Medicine:
${
  OPDCard.regimenHomeMedication !== null &&
  OPDCard.regimenHomeMedication !== undefined
    ? OPDCard.regimenHomeMedication
    : "none"
}
                `}
                    // autoSize={{ minRows: 3, maxRows: 20 }}
                    rows={20}
                    cols={10}
                  />
                </div>
              </>
            )}
          </div>

          {isContentVisible ? (
            <>
              <div
                className="underline"
                style={{
                  background: "#06264e",
                  height: "1.3px",
                }}
              />
              <h3>Medicine Request</h3>
              <div className="label-check-insurance">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={isChecked}
                  onChange={checkHandler}
                  disabled
                />
                <h3>Insurance</h3>
              </div>
              {isChecked ? (
                <table className="table-med-req">
                  <thead>
                    <tr className="headingg">
                      <th className="title">Medicine</th>
                      <th className="title">Bottle</th>
                      <th className="title">Pharmacy Proposed</th>
                      <th className="title">Inventory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OPDCard?.drugs &&
                      OPDCard?.drugs.map((drug, index) => (
                        <React.Fragment key={`${drug.name}-${index}`}>
                          {drug.bottles.map(
                            (bottle, bottleIndex) =>
                              bottle.quantity > 0 && (
                                <tr
                                  className="headingg"
                                  key={`${drug.name}-${index}-${bottleIndex}`}
                                >
                                  {bottleIndex === 0 && (
                                    <td
                                      className="bodyy"
                                      rowSpan={drug.bottles.length}
                                    >
                                      {drug.name} {bottle.quantity} mg
                                    </td>
                                  )}
                                  <td className="body-bottle">{bottle.name}</td>
                                  <td className="bodyy">{bottle.quantity}</td>
                                  <td className="bodyy">{bottle.inventory}</td>
                                </tr>
                              )
                          )}
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              ) : (
                <table className="table-med-req">
                  <thead>
                    <tr className="headingg">
                      <th className="title">Medicine</th>
                      <th className="title">Bottle</th>
                      <th className="title">Proposed quantity</th>
                      <th className="title">Inventory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drugs &&
                      Object.entries(drugs).map(([name, drug]) => {
                        let previousMedicine: any = null;
                        return drug.bottles.map((bottle, bottleIndex) => {
                          const medicineCell = (
                            <td
                              className="bodyy"
                              key={`${name}-${bottleIndex}-medicine`}
                              rowSpan={
                                name === previousMedicine
                                  ? 0
                                  : drug.bottles.length
                              }
                            >
                              {name} {calculateTotalDoctorAmount(name)} mg
                            </td>
                          );
                          previousMedicine = name;
                          return (
                            <tr
                              className="headingg"
                              key={`${name}-${bottleIndex}`}
                            >
                              {bottleIndex === 0 ? medicineCell : null}
                              <td
                                className="bodyy-hi"
                                key={`${name}-${bottleIndex}-bottle`}
                              >
                                {bottle.name}
                              </td>
                              <td
                                key={`${name}-${bottleIndex}-quantity`}
                                className="bodyy"
                              >
                                <InputNumber
                                  defaultValue={bottle.quantity}
                                  min={0}
                                  onChange={(quantity) =>
                                    handleOnChangeNumber(
                                      name,
                                      bottleIndex,
                                      quantity ?? 0
                                    )
                                  }
                                />
                              </td>
                              <td
                                key={`${name}-${bottleIndex}-inventory`}
                                className="bodyy"
                              >
                                {bottle.inventory}
                              </td>
                            </tr>
                          );
                        });
                      })}
                  </tbody>
                </table>
              )}
              <div className="ccoonn">
                <div className="spaceee"></div>
                <div className="two-button-mq-1">
                  <Link to="/homepage">
                    <Button htmlType="submit" className="submit-button5">
                      Back
                    </Button>
                  </Link>
                  <Button
                    htmlType="submit"
                    className="submit-button5"
                    onClick={handleButtonClick}
                  >
                    Calculate Cost
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <CostEstimation
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
                data={isChecked ? OPDCardDrugs : drugs}
              />
              <div className="ccoonn">
                <div className="spaceee"></div>
                <div className="two-button-mq-1">
                  {/* New Content */}
                  <Button
                    htmlType="submit"
                    className="submit-button5"
                    onClick={handleButtonClick}
                  >
                    Back
                  </Button>
                  <Button
                    htmlType="submit"
                    className="submit-button5"
                    onClick={handlePrintPreview}
                  >
                    Print Preview
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <PrintPreview
            name={name}
            btc={btc}
            dtc={dtc}
            wbc={wbc}
            emc={emc}
            thc={thc}
            pmc={pmc}
            meddata={isChecked ? OPDCardDrugs : drugs}
          />
          {/* <p>Print preview page</p> */}
          <div className="two-button-mq-12">
            <Button className="submit-button5" onClick={handlePrintPreview}>
              Back
            </Button>
            <Button onClick={handleCostUpdate} className="submit-button5">
              Complete
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Box;
