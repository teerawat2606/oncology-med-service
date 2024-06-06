import { useState, useEffect } from "react";
import "./index.css";
import { cycleApi } from "../../api";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import React from "react";
import { UsageSummaryData } from "../../interfaces";
import { Button, Form } from "antd";

const UsageSummary = () => {
  const { cycleId } = useParams();
  const navigate = useNavigate();
  const [usageSummaryData, setUsageSummaryData] = useState<UsageSummaryData>();
  const onFinish = async (values: any) => {
    console.log(values);

    try {
      const res = await cycleApi.patchUsageSummary(
        cycleId,
        usageSummaryData?.drugs?.flatMap((drug: any) =>
          drug.bottles.map((bottle: any) => ({
            id: bottle.id,
            return: 0,
          }))
        )
      );
      const result = await res.json();
      navigate("/homepage", { replace: true });
      console.log("Success:", result);
      console.log(values);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    const fetchData = async () => {
      const usageSummary = await cycleApi.getUsageSummary(Number(cycleId));
      setUsageSummaryData(usageSummary);
      console.log(usageSummary);
    };
    fetchData();
  }, [cycleId]);

  return (
    <div className="page-container-usagesummary">
      {usageSummaryData ? (
        <div className="table-container-usagesummary">
          <div className="cycle1">
            <div className="usage-summary-header">
              <div>
                <h5>Usage Summary</h5>
              </div>
              <div className="patientcard">
                <p>
                  {`${usageSummaryData.patient.name} (HN ${usageSummaryData.patient.HN})`}
                </p>
                <p>{usageSummaryData.doctorName}</p>
                <p>{`regimen: ${usageSummaryData.regimenName}`}</p>
              </div>
            </div>
          </div>
          <Form
            name="recheckmedicine"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <table className="usagesummary">
              <thead className="heading">
                <tr>
                  <td className="usagesummaryheadermedicine">
                    List of Medicine
                  </td>
                  <td className="usagesummaryheaderrequest">Request</td>
                  <td className="usagesummaryheader"></td>
                </tr>
              </thead>
              <tbody>
                {usageSummaryData.drugs.map((drug, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td colSpan={3} className="medicine">
                        {`${drug.name} ${drug.quantity} mg `}
                      </td>
                    </tr>

                    {drug.bottles.map((bottle, subIndex) => (
                      <tr key={subIndex}>
                        <td className="size">{bottle.name}</td>
                        <td className="request">{bottle.quantity}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            <div className="allusagesummarybutton">
              <div className="usagesummarybutton1">
                <Link className="usagesummarybutton" to="/homepage">
                  Back
                </Link>
              </div>
              <div className="usagesummarybutton1">
                <Link
                  className="usagesummarybutton"
                  to={`/return-medicine/${cycleId}`}
                >
                  Return
                </Link>
                <Button htmlType="submit" className="usagesummarybutton">
                  Complete
                </Button>
              </div>
            </div>
          </Form>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UsageSummary;
