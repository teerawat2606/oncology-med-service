import { useState, useEffect } from "react";
import { cycleApi } from "../../api";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import React from "react";
import { Inventory } from "../../interfaces";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  InputNumber,
} from "antd";
import "./index.css";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const OrderMedicine = () => {
  const { cycleId } = useParams();
  const navigate = useNavigate();
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };
  const [form] = Form.useForm();

  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY-MM-DD";
  const [inventoryData, setInventoryData] = useState<Inventory>();

  const onFinish = async (values: any) => {
    console.log(values);
    try {
      const res = await cycleApi.patchInventory(
        cycleId,
        values["inventoryPRnumber"],
        values["inventoryPRDate"].format(dateFormat),
        inventoryData?.drugs?.flatMap((drug: any) =>
          drug.bottles.map((bottle: any) => ({
            id: bottle.id,
            purchase: values[`purchase_${bottle.id}`],
          }))
        ) as [{ id: number; purchase: number }],
        values["inventoryNote"]
      );

      const result = await res.json(); // Store the parsed JSON data
      console.log(result);

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
      const inventory = await cycleApi.getInventory(Number(cycleId));
      setInventoryData(inventory);
      console.log(inventory);
    };
    fetchData();
  }, [cycleId]);

  return (
    <div className="page-container">
      {inventoryData ? (
        <div className="table-container-ordermed">
          <Form
            name="recheckmedicine"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
          >
            <div className="cycle1">
              <div className="usage-summary-header">
                <div>
                  <h1>Order Medicine</h1>
                  <div className="patientcard">
                    <p>
                      {`${inventoryData.patient.name} (HN ${inventoryData.patient.HN})`}
                    </p>
                    <p>{inventoryData.doctorName}</p>
                    <p>{`regimen: ${inventoryData.regimenName}`}</p>
                  </div>
                </div>
                <div className="inventoryPR">
                  <Form.Item
                    name="inventoryPRnumber"
                    label="PR Number"
                    rules={[{ required: true }]}
                  >
                    <Col span={4}>
                      <InputNumber maxLength={12} style={{ width: "152px" }} />
                    </Col>
                  </Form.Item>
                  <Form.Item
                    name="inventoryPRDate"
                    label="Date"
                    // rules={[{ required: true }]}
                  >
                    {/* <Col span={4}> */}
                    <DatePicker
                      onChange={onChange}
                      // defaultValue={dayjs("2024-03-28")}
                      // format={dateFormat}
                      style={{ width: "152px" }}
                    />
                    {/* <InputNumber maxLength={12} style={{ width: "152px" }} /> */}
                    {/* </Col> */}
                  </Form.Item>
                </div>
              </div>
            </div>

            <table className="ordermedicine">
              <thead className="heading">
                <tr>
                  <td className="ordermedicineheader">List of Medicine</td>
                  <td className="ordermedicineheader">
                    <p>Pharmacy</p>
                    <p>Proposed</p>
                  </td>
                  <td className="ordermedicineheader">Available</td>
                  <td className="ordermedicineheader">Purchase</td>
                </tr>
              </thead>
              <tbody>
                {inventoryData.drugs.map((drug, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td colSpan={3} className="medicine">
                        {`${drug.name} ${drug.quantity} mg`}
                      </td>
                    </tr>

                    {drug.bottles.map((bottle, subIndex) => (
                      <tr key={subIndex}>
                        <td className="size">{bottle.name}</td>
                        <td className="request">{bottle.quantity}</td>
                        <td className="request">{bottle.inventory}</td>
                        <td className="request">
                          <Form.Item
                            initialValue={0}
                            name={`purchase_${bottle.id}`}
                            rules={[
                              {
                                required: true,
                                message: "Please select a purchase quantity!",
                              },
                            ]}
                          >
                            <InputNumber
                              defaultValue={bottle.quantity}
                              min={0}
                            />
                          </Form.Item>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="notefromdoctor">
              <p>Note from pharmacy</p>
              <p>{inventoryData.pharmacyNote}</p>
            </div>
            <div className="notefrompharmacy">
              <p>Note from Inventory</p>
              <Form.Item name={"inventoryNote"}>
                <TextArea
                  rows={4}
                  placeholder="Note Area"
                  style={{ width: "calc(100vw - 500px)" }}
                />
              </Form.Item>
            </div>
            <div className="allusagesummarybutton">
              <div className="usagesummarybutton1">
                <Button
                  onClick={() => navigate("/homepage")}
                  className="usagesummarybutton"
                >
                  Back
                </Button>
              </div>
              <div className="usagesummarybutton1">
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

export default OrderMedicine;
