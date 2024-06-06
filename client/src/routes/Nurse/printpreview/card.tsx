import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CostSummary from "../../../interfaces/cost.summary";
import { cycleApi } from "../../../api";
import { MedRequestInputType } from "../med-quantity/box";
import "./card.css";

interface CardProps {
  // title?: string;
  name: string;
  wbc: number | null;
  btc: number | null;
  pmc: number | null;
  thc: number | null;
  dtc: number | null;
  emc: number | null;
  meddata: MedRequestInputType;
}

export const Card: React.FC<CardProps> = ({
  name,
  wbc,
  btc,
  pmc,
  thc,
  dtc,
  emc,
  meddata,
}) => {
  const { cycleId } = useParams();
  const [data, setData] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      if (cycleId) {
        try {
          const costData = await cycleApi.getCostSummary(+cycleId);
          if (costData != null) {
            setData(costData);
            console.log(data);
          }
        } catch (error) {
          console.error("Error fetching cost data:", error);
        }
      }
    };

    fetchData();
  }, [cycleId]);

  console.log(data?.patient?.cycles?.regimen!.name);

  // calculate total cost
  let totalCost = 0;
  Object.entries(meddata).forEach(([name, drug]) => {
    drug.bottles.forEach((bottle, bottleIndex) => {
      if (bottle.quantity > 0) {
        totalCost += bottle.quantity * bottle.cost;
      }
    });
  });
  // Check if btc is not null before adding it to the total cost
  if (btc !== null) {
    totalCost += btc;
  }

  // Check if pmc is not null before adding it to the total cost
  if (pmc !== null) {
    totalCost += pmc;
  }

  // Check if thc is not null before adding it to the total cost
  if (thc !== null) {
    totalCost += thc;
  }

  // Check if dtc is not null before adding it to the total cost
  if (dtc !== null) {
    totalCost += dtc;
  }

  // Check if emc is not null before adding it to the total cost
  if (emc !== null) {
    totalCost += emc;
  }

  // Check if wbc is not null before adding it to the total cost
  if (wbc !== null) {
    totalCost += wbc;
  }

  return (
    <div className="card-container">
      {/* <img
        src={https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT11I5Er0OA9ZUMTeB7CntLIX-lm8XWkqpQl1vc-VCJLw&s}
        alt="Sample"
        className="card-image"
      /> */}
      <h2 className="card-title">
        {" "}
        ข้อมูลประกอบการประเมินค่าใช้จ่ายการรักษาด้วยยาของผู้ป่วย Oncology center{" "}
      </h2>
      {/* {title} */}
      <div className="top-section">
        <div className="top-content">
          <h4> เรียนเจ้าหน้าที่แผนก admission</h4>
          {/* can not add space between each line */}
          <h4>ขอแจ้งรายละเอียดการประเมิน ของผู้ป่วยชื่อ</h4>
        </div>
        <div className="patient-sticker">
          <h4>Sticker ชื่อผู้ป่วย</h4>
        </div>
      </div>
      <div className="name-detail-container">
        {data && (
          <>
            <h4 className="name-detail">
              {" "}
              ชื่อยา/สูตรยา ..........................{data?.regimen.name}
              ..........................
            </h4>
          </>
        )}

        <h4 className="name-detail">
          {" "}
          รายละเอียดสูตรยา
          .................................................................................................................................{" "}
        </h4>
        <h4 className="name-detail">
          {" "}
          สถานที่ให้ยา
          <div className="list-box">
            <div className="check-box"> </div>
            <h4 className="space-bet"> Oncology Center</h4>
            <div className="check-box"> </div>
            <h4 className="space-bet"> Observe 6 hrs. at ward</h4>
            <div className="check-box"> </div>
            <h4 className="space-bet"> Admit</h4>
          </div>
        </h4>
      </div>
      <div className="medicine-list">
        <h4 className="medicine-cost-title">ค่าใช้จ่ายการให้ยาโดยประมาณ</h4>
        {/* table med  */}
        <table className="table-med-req">
          {/* <thead>
            <tr className="heading-med">
              <th className="title">Medicine</th>
              <th className="title">Size</th>
              <th className="title">Price</th>
              <th className="title">Unit</th>
            </tr>
          </thead> */}
          <tbody>
            {meddata &&
              Object.entries(meddata).map(([name, drug]) =>
                drug.bottles.map((bottle, bottleIndex) => {
                  return (
                    bottle.quantity > 0 && (
                      <tr
                        className="heading-medd"
                        key={`${name}-${bottleIndex}`}
                      >
                        {/* Assuming you want to display properties from both drugBottle and bottle */}
                        <td
                          className="tab-medicine"
                          key={`${name}-${bottleIndex}`}
                        >
                          ค่ายา {name} {drug.quantity} mg {bottle.name}
                        </td>

                        {/* <td className="bodyy" key={`${name}-${bottleIndex}`}>
                        {bottle.name}
                      </td> */}

                        {/* You can add more td elements for other properties */}
                        <td className="tab-cost" key={`${name}-${bottleIndex}`}>
                          {bottle.quantity * bottle.cost}
                        </td>
                        <td className="tab-unit">บาท</td>
                        {/* <td key={`${name}-${bottleIndex}`} className="bodyy">
                        {bottle.inventory}
                      </td> */}
                      </tr>
                    )
                  );
                })
              )}
            <tr className="heading-medd">
              <td className="tab-medicine">
                ค่าตรวจเลือดเตรียมความพร้อมก่อนให้ยา
              </td>
              <td className="tab-cost">{btc}</td>
              <td className="tab-unit">บาท</td>
            </tr>

            <tr className="heading-medd">
              <td className="tab-medicine">ค่ายาก่อนให้ยา</td>
              <td className="tab-cost">{pmc}</td>
              <td className="tab-unit">บาท</td>
            </tr>
            <tr className="heading-medd">
              <td className="tab-medicine">ค่ายากลับบ้าน</td>
              <td className="tab-cost">{thc}</td>
              <td className="tab-unit">บาท</td>
            </tr>
            <tr className="heading-medd">
              <td className="tab-medicine">ค่าแพทย์</td>
              <td className="tab-cost">{dtc}</td>
              <td className="tab-unit">บาท</td>
            </tr>
            <tr className="heading-medd">
              <td className="tab-medicine">ค่าอุปกรณ์และเวชภัณฑ์ทางการแพทย์</td>
              <td className="tab-cost">{emc}</td>
              <td className="tab-unit">บาท</td>
            </tr>
            <tr className="heading-medd">
              <td className="tab-medicine"> ค่ายากระตุ้นเม็ดเลือดขาว {name}</td>
              <td className="tab-cost">{wbc}</td>
              <td className="tab-unit">บาท</td>
            </tr>
            <tr className="heading-medd">
              <td className="tab-medicine">รวมราคา</td>
              <td className="tab-cost">{totalCost}</td>
              <td className="tab-unit">บาท</td>
            </tr>
          </tbody>
        </table>
        {/* list of med end */}
      </div>
      <div className="more-info">
        <h4 className="more-info-title">หมายเหตุ</h4>
        <h4 className="moreinfo">
          1. ราคานี้ไม่รวมค่าห้อง และภาวะแทรกซ้อนต่าง ๆ
        </h4>
        <h4 className="moreinfo">
          2. เอกสารนี้ใช้ในการสื่อสารภายในกับแผนก Admission เท่านั้น
        </h4>
      </div>
      <div className="sig-sign">
        <h4 className="moreinfo">
          พยาบาลผู้ประเมิน : ......................................... Oncology
          Center
        </h4>
        <h4 className="moreinfo">
          วันที่ประเมิน : ............................................
        </h4>
      </div>
    </div>
  );
};
