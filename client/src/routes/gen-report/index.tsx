import React, { useState } from "react";
import { Button, DatePicker } from "antd";
import generatePDF, { Options } from "react-to-pdf";
import "./index.css";
import { Report } from "../../interfaces/report";
import { BACKEND_URL } from "../../api";

interface Formula {
  drugName: string;
  formulaQuantity: number;
  formulaUnit: string;
  location: string;
}
const { RangePicker } = DatePicker;
const options: Options = {
  filename: "weekly-report.pdf",
};

const downloadPdf = () => {
  const targetElement = document.getElementById("container");
  if (targetElement) {
    generatePDF(() => targetElement, options);
  } else {
    console.error("Container element not found");
  }
};

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="containerpdf">{children}</div>;
};

const GenReport = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState<Report[]>([]);

  const handleClick = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/cycle/appointments?fromDate=${fromDate}&toDate=${toDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          // credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);
      setReportData(data);
      setIsVisible(true);
    } catch (err) {
      console.log(err);
    }
  };

  // Group the formulas by location
  const groupedFormulas: { [key: string]: Formula[] } = reportData
    .flatMap((report) => report.formulas)
    .reduce((groups: { [key: string]: Formula[] }, formula: Formula) => {
      const location = formula.location;
      if (!groups[location]) {
        groups[location] = [];
      }
      groups[location].push(formula);
      return groups;
    }, {});

  // Sort the locations
  const sortedLocations = Object.keys(groupedFormulas).sort();

  return (
    <div className="page-container">
      <div className="table-container-report">
        <h2> Report summary</h2>
        <div className="rep-sum">
          <RangePicker
            onChange={(date, dateString) => {
              console.log(date);
              console.log(dateString);
              setFromDate(dateString[0]);
              setToDate(dateString[1]);
            }}
          />

          <Button
            htmlType="submit"
            className="apply-button"
            onClick={handleClick}
          >
            Apply
          </Button>
        </div>
        {isVisible && (
          <Container>
            <div id="container">
              <div className="card-container">
                <div className="medicine-list">
                  <table className="table-report">
                    <tbody>
                      {/* Row with headings */}
                      <tr className="report-sum-tab">
                        <td className="hn-tab">HN</td>
                        <td className="name-tab">ชื่อผู้ป่วย</td>
                        <td className="date-tab">วันที่ใช้ยา</td>
                        <td className="regimen-tab">Regimen</td>
                        <td className="item-tab">Item</td>
                        <td className="unit-tab">จำนวน</td>
                      </tr>

                      {/* Mapping report data */}
                      {reportData.map((report) =>
                        report.bottles.map((bottle, bottleIndex) => (
                          <tr
                            key={`${report.id}_${bottleIndex}`}
                            className="report-sum-tab"
                          >
                            {/* Merge cells in HN column */}
                            {bottleIndex === 0 && (
                              <td
                                className="hn-tab"
                                rowSpan={report.bottles.length}
                              >
                                {report.patientHN}
                              </td>
                            )}

                            {/* Merge cells in Name column */}
                            {bottleIndex === 0 && (
                              <td
                                className="name-tab"
                                rowSpan={report.bottles.length}
                              >
                                {report.patientName}
                              </td>
                            )}

                            {/* Merge cells in Date column */}
                            {bottleIndex === 0 && (
                              <td
                                className="date-tab"
                                rowSpan={report.bottles.length}
                              >
                                {report.appointmentDate}
                              </td>
                            )}

                            {/* Merge cells in Regimen column */}
                            {bottleIndex === 0 && (
                              <td
                                className="regimen-tab"
                                rowSpan={report.bottles.length}
                              >
                                {report.regimenName}
                              </td>
                            )}

                            {/* Individual cells for Item and Quantity columns */}
                            <td className="item-tab">{bottle.name}</td>
                            <td className="unit-tab">{bottle.quantity}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  <table className="table-report">
                    <tbody>
                      <tr className="report-sum-tab">
                        <td className="drug-name-tab">Drug Name</td>
                        <td className="formula-quantity-tab">
                          Formula Quantity
                        </td>
                        <td className="location-tab">Location</td>
                      </tr>
                      {/* Render table rows for each location */}
                      {sortedLocations.map((location) => {
                        const formulas = groupedFormulas[location];
                        return (
                          <React.Fragment key={location}>
                            {/* Render rows for each formula at the same location */}
                            {formulas.map((formula, index) => (
                              <tr
                                key={`${location}_${index}`}
                                className="report-sum-tab"
                              >
                                {/* Merge cells in "Location" column */}
                                {index === 0 && (
                                  <td
                                    className="location-tab"
                                    rowSpan={formulas.length}
                                  >
                                    {location}
                                  </td>
                                )}
                                {/* Render "Drug Name" and "Formula Quantity" cells */}
                                <td className="drug-name-tab">
                                  {formula.drugName}
                                </td>
                                <td className="formula-quantity-tab">
                                  {formula.formulaQuantity}{" "}
                                  {formula.formulaUnit}
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <button onClick={downloadPdf} className="download-button">
              Download PDF
            </button>
          </Container>
        )}
      </div>
    </div>
  );
};

export default GenReport;
