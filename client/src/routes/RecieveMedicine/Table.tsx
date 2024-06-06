import React from "react";
import "./Table.css";
import { Link, useNavigate } from "react-router-dom";
import { RecieveMedicineData } from "../../interfaces";
import { Button, Form, InputNumber } from "antd";
import cycleApi from "../../api/cycleApi";

interface Props {
  recieveMedicineData: RecieveMedicineData;
  cycleId: string | undefined;
}

const Table: React.FC<Props> = ({ recieveMedicineData, cycleId }) => {
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    console.log(values);
    console.log(recieveMedicineData.drugs);
    try {
      const res = await cycleApi.patchRecieveMedicine(
        cycleId,
        recieveMedicineData?.drugs?.flatMap((drug: any) =>
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
              {`${recieveMedicineData.patient.name} (HN ${recieveMedicineData.patient.HN})`}
            </p>
            <p>{recieveMedicineData.doctorName}</p>
            <p>{`regimen: ${recieveMedicineData.regimenName}`}</p>
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
              <td className="returnmedicineheaderrequest">Return</td>
              <td className="returnmedicineheaderreturn">Receive</td>
            </tr>
          </thead>
          <tbody>
            {recieveMedicineData.drugs.map((drug, index) => (
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
                    <td className="request">{bottle.return}</td>
                    <td className="return">
                      <Form.Item
                        initialValue={0}
                        name={`return_${bottle.id}`}
                        rules={[
                          {
                            required: true,
                            message: "Please select a quantity!",
                          },
                        ]}
                      >
                        <InputNumber defaultValue={bottle.quantity} min={0} />
                      </Form.Item>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="allrecheckmedicinebutton">
          <div className="returnmedicinebutton1">
            <Button
              onClick={() => navigate("/homepage")}
              className="usagesummarybutton"
            >
              Back
            </Button>
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
