import React, { useEffect, useState } from "react";
import { Button, DatePicker, Popconfirm, message } from "antd";
import generatePDF, { Options } from "react-to-pdf";
import "./index.css";
import { BACKEND_URL } from "../../api";
import getInventoryReport from "../../api/inventoryreport";
import { Navigate, useParams } from "react-router";
import InventoryReport from "../../interfaces/InventoryReport";
import { useNavigate } from "react-router";
import { cycleApi } from "../../api";
import CycleDetails from "../../interfaces/CycleDetails";

const options: Options = {
  filename: "inventoryPDF.pdf",
};

export interface drugsummary {
  id: number;
  patientName: string;
  appointmentDate: string; // Consider using Date type if the date will be a Date object
  regimenName: string;
  bottles: bottle[];
}
export interface bottle {
  id: number;
  name: string;
  quantity: number;
  cost: number;
  inventory: number;
  return: number;
  purchase: number;
  returnReceived: number;
}

const downloadPdf = () => {
  const targetElement = document.getElementById("container8");
  if (targetElement) {
    generatePDF(() => targetElement, options);
  } else {
    console.error("Container element not found");
  }
};

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="containerpdf">{children}</div>;
};

const InventoryPDF = () => {
  const navigate = useNavigate();
  const { cycleId } = useParams();
  const [isVisible, setIsVisible] = useState(true);
  const [reportData, setReportData] = useState<InventoryReport>();
  const [cycledetailData, setcycledetailData] = useState<CycleDetails>();

  useEffect(() => {
    if (cycleId) {
      const fetchData = async () => {
        const data = await getInventoryReport(Number(cycleId));
        const cycledetailfromapi = await cycleApi.getCycleDetails(
          Number(cycleId)
        );
        if (cycleId) {
          console.log(data);
          setReportData(data);
          setcycledetailData(cycledetailfromapi);
        }
      };
      fetchData();
    }
  }, [cycleId]);

  const onBack = async () => {
    navigate("/homepage");
  };

  const Changestatus = async () => {
    try {
      // Endpoint URL
      const url = `${BACKEND_URL}/cycle/order/${cycleId}`;
      // PATCH request options
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      // Send the PATCH request
      const response = await fetch(url, options);

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response body
      const data = await response.json();
      console.log("Status changed successfully:", data);
    } catch (error) {
      console.error("Error changing status:", error);
    }
    navigate("/homepage");
  };

  const confirm = async () => {
    try {
      // Endpoint URL
      const url = `${BACKEND_URL}/cycle/order/${cycleId}`;
      message.success("The status is updated successfully.");
      // PATCH request options
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      // Send the PATCH request
      const response = await fetch(url, options);
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Parse the response body
      const data = await response.json();
      console.log("Status changed successfully:", data);
    } catch (error) {
      console.error("Error changing status:", error);
    }
    navigate("/homepage");
  };

  const cancel = () => {
    message.error("Click on No");
  };

  return (
    <div className="page-container-pdf8">
      <div className="table-container-pdf8">
        <h2> Report summary</h2>

        <div className="rep-sum8"></div>
        {isVisible && (
          <Container>
            <div id="container8">
              <div className="card-container8">
                <div className="medicine-list8">
                  <div className="tophead8">
                    <h2 className="papername8">
                      รายงาน การจองยานอกบัญชี ยาเฉพาะเคส ยาเคมีบำบัด
                    </h2>

                    <div className="headline8">
                      <p>HN: {cycledetailData?.patient.HN}</p>
                      <p>ชื่อผู้ป่วย: {reportData?.patientName}</p>
                    </div>

                    <div className="divider" />

                    <div className="lines">
                      <div className="line1">
                        <p>Regimen: {reportData?.regimenName}</p>
                      </div>
                      <div className="line2">
                        <p>วันที่ใช้ยา: {reportData?.appointmentDate}</p>
                      </div>
                      <div className="line3">
                        <p>แพทย์ผู้จอง : {cycledetailData?.doctorName}</p>
                      </div>
                    </div>
                  </div>
                  <p>รายการยาที่ต้องการ</p>
                  <table className="table-report8">
                    <tbody>
                      {/* Row with headings */}
                      <tr className="report-sum-tab8">
                        <td className="item-tabhead8">Item</td>
                        <td className="unit-tabhead8">จำนวน</td>
                      </tr>

                      {/* Mapping report data */}
                      {reportData?.bottles.map((bottle) => (
                        // drug.bottles.map((bottle, bottleIndex) => (
                        <tr key={`${bottle.id}`} className="report-sum-tab8">
                          {/* Individual cells for Item and Quantity columns */}
                          <td className="item-tab8">{bottle.name}</td>
                          <td className="unit-tab8">{bottle.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="divider8" />
                  <div className="bottomline8">
                    <p>complete: Purchase</p>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={downloadPdf} className="download-button8">
              Download PDF
            </button>
          </Container>
        )}

        <div className="twoinvenpdfbutton8">
          <Button onClick={() => onBack()} className="invenpdfbutton8">
            Back
          </Button>
          {/* <Button onClick={Changestatus} className="invenpdfbutton">
          Done
        </Button> */}
          <Popconfirm
            title="Please check the detail"
            description="Are you sure that you recieve the order?.
          If you confirm this, You can't edit this anymore."
            onConfirm={() => confirm()}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button className="invenpdfbutton8">Done</Button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};

export default InventoryPDF;
