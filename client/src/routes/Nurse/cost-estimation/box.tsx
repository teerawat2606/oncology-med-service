import { useEffect, useState } from "react";
import "./box.css";
import { Outlet, Link, useLocation, useParams, Form } from "react-router-dom";
import { Button, Input, InputNumber } from "antd";
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

const linkArr = [
  {
    name: "Back",
    path: "/backtomedquan",
  },
  {
    name: "Generate Report",
    path: "/printpreview",
  },
];

interface FormComponentProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Box: React.FC<CostEstimationProps> = ({
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
  const { cycleId } = useParams();
  const { pathname } = useLocation();
  console.log(pathname);

  return (
    <div>
      <div
        className="underline"
        style={{
          background: "#06264e",
          height: "1.3px",
        }}
      />
      <h3>Estimated Cost</h3>
      <h4 className="initial-cost">Medicine Cost</h4>

      <table className="table-med-req">
        <thead>
          <tr className="headingg">
            <th className="title">Medicine</th>
            <th className="title">Bottle</th>
            <th className="title">Price</th>
            <th className="title">Unit</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            Object.entries(data).map(([name, drug]) =>
              drug.bottles.map((bottle, bottleIndex) => {
                return (
                  bottle.quantity > 0 && (
                    <tr className="headingg" key={`${name}-${bottleIndex}`}>
                      {/* Assuming you want to display properties from both drugBottle and bottle */}
                      <td className="bodyy" key={`${name}-${bottleIndex}`}>
                        {name} {drug.quantity} mg
                      </td>

                      <td className="bodyy" key={`${name}-${bottleIndex}`}>
                        {bottle.name}
                      </td>

                      {/* You can add more td elements for other properties */}
                      <td key={`${name}-${bottleIndex}`} className="bodyy">
                        {bottle.quantity * bottle.cost}
                      </td>
                      <td key={`${name}-${bottleIndex}`} className="bodyy">
                        บาท
                      </td>
                    </tr>
                  )
                );
              })
            )}
        </tbody>
      </table>
      <h4 className="initial-cost"> Initial Cost</h4>
      <table className="table-med-req">
        <thead>
          <tr className="headingg">
            <th className="title">Title</th>
            <th className="title">Price</th>
            <th className="title">Unit</th>
          </tr>
        </thead>
        <tbody>
          <tr className="headingg">
            <td className="bodyy">ค่าตรวจเลือดเตรียมความพร้อมก่อนให้ยา</td>
            <td className="bodyy">
              <InputNumber
                defaultValue={0}
                min={0}
                value={btc !== null ? btc : undefined} // Cast null to undefined
                onChange={(newValue) =>
                  setBtc(newValue !== undefined ? newValue : null)
                }
              />
            </td>
            <td className="bodyy">บาท</td>
          </tr>

          <tr className="headingg">
            <td className="bodyy">ค่ายาก่อนให้ยา (Pre-medication)</td>
            <td className="bodyy">
              {" "}
              <InputNumber
                defaultValue={0}
                min={0}
                value={pmc !== null ? pmc : undefined}
                onChange={(newValue) =>
                  setPmc(newValue !== undefined ? newValue : null)
                }
              />
            </td>
            <td className="bodyy">บาท</td>
          </tr>
          <tr className="headingg">
            <td className="bodyy">ค่ายากลับบ้าน</td>
            <td className="bodyy">
              <InputNumber
                defaultValue={0}
                min={0}
                value={thc !== null ? thc : undefined}
                onChange={(newValue) =>
                  setThc(newValue !== undefined ? newValue : null)
                }
              />
            </td>
            <td className="bodyy">บาท</td>
          </tr>
          <tr className="headingg">
            <td className="bodyy">ค่าแพทย์ (Cancer Therapy)</td>
            <td className="bodyy">
              <InputNumber
                defaultValue={0}
                min={0}
                value={dtc !== null ? dtc : undefined}
                onChange={(newValue) =>
                  setDtc(newValue !== undefined ? newValue : null)
                }
              />
            </td>
            <td className="bodyy">บาท</td>
          </tr>
          <tr className="headingg">
            <td className="bodyy">ค่าอุปกรณ์และเวชภัณฑ์ทางการแพทย์</td>
            <td className="bodyy">
              <InputNumber
                defaultValue={0}
                min={0}
                value={emc !== null ? emc : undefined}
                onChange={(newValue) =>
                  setEmc(newValue !== undefined ? newValue : null)
                }
              />
            </td>
            <td className="bodyy">บาท</td>
          </tr>
          <tr className="headingg">
            <td className="bodyy">
              ค่ายากระตุ้นเม็ดเลือดขาว{" "}
              <Input
                style={{ width: "250px" }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </td>
            <td className="bodyy">
              <InputNumber
                defaultValue={0}
                min={0}
                value={wbc !== null ? wbc : undefined}
                onChange={(newValue) =>
                  setWbc(newValue !== undefined ? newValue : null)
                }
              />
            </td>
            <td className="bodyy">บาท</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Box;
function useHistory() {
  throw new Error("Function not implemented.");
}
