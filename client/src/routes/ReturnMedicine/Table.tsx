import React from "react";
import "./Table.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UsageSummaryData } from "../../interfaces";
import { Button, Form, InputNumber } from "antd";
import cycleApi from "../../api/cycleApi";

interface Props {
  usageSummaryData: UsageSummaryData;
  cycleId: string | undefined;
}

const Table: React.FC<Props> = ({ usageSummaryData, cycleId }) => {
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    console.log(values);
    console.log(usageSummaryData.drugs);
    try {
      const res = await cycleApi.patchUsageSummary(
        cycleId,
        usageSummaryData?.drugs?.flatMap((drug: any) =>
          drug.bottles.map((bottle: any) => ({
            id: bottle.id,
            return: values[`return_${bottle.id}`],
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
  return (
    <div className="table-container-usagesummary">
      <div className="cycle1">
        <div className="returnmedicineheading">
          <div>
            <h1>Return Medicine</h1>
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
        name="returnmedicine"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <table className="returnmedicine">
          <thead className="heading">
            <tr>
              <td className="returnmedicineheadermedicine">List of Medicine</td>
              <td className="returnmedicineheaderrequest">Request</td>
              <td className="returnmedicineheaderreturn">Return</td>
            </tr>
          </thead>
          <tbody>
            {usageSummaryData.drugs.map((drug, index) => (
              <React.Fragment key={index}>
                {/* drug */}
                <tr>
                  <td colSpan={3} className="medicine">
                    {`${drug.name} ${drug.quantity} mg`}
                  </td>
                </tr>
                {/* bottles */}
                {drug.bottles.map((bottle, subIndex) => (
                  <tr key={subIndex}>
                    <td className="size">{bottle.name}</td>
                    <td className="request">{bottle.quantity}</td>
                    <td className="return">
                      <Form.Item
                        name={`return_${bottle.id}`}
                        initialValue={0}
                        rules={[
                          {
                            required: true,
                            message: "Please select a quantity!",
                          },
                        ]}
                      >
                        <InputNumber defaultValue={0} min={0} />
                      </Form.Item>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className="allreturnmedicinebuttonn">
          <div className="returnmedicinebutton1">
            <Link
              className="returnmedicinebutton"
              to={`/usage-summary/${cycleId}`}
            >
              Back
            </Link>
          </div>
          <div className="returnmedicinebutton1">
            <Button htmlType="submit" className="usagesummarybutton">
              Complete
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Table;
