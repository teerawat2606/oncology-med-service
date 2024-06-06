import { Button, Col, Form, Input, Row } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { drugApi } from "../../../api";
import "./index.css";

function AddNewMedicine() {
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    console.log(values);
    try {
      const res = await drugApi.postDrug(values["drugName"]);
      const res2 = await res.json();
      const result = await drugApi.postBottle(
        res2.id,
        values["bottleName"],
        values["bottlePrice"]
      );
      console.log(res2);
      console.log(result);
      navigate("/add-med", { replace: true });
      window.location.reload();
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
    <div>
      <Form
        name="recheckmedicine"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Col span={8}>
          <Form.Item
            name={"drugName"}
            label="Drug name"
            rules={[
              {
                required: true,
                message: "Please enter drug name",
              },
            ]}
          >
            <Input></Input>
          </Form.Item>
        </Col>
        <Row>
          <Col span={8}>
            <Form.Item
              name={"bottleName"}
              label="Bottle name"
              rules={[
                {
                  required: true,
                  message: "Please enter bottle name",
                },
              ]}
            >
              <Input></Input>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={"bottlePrice"}
              label="price"
              rules={[
                {
                  required: true,
                  message: "Please enter bottle's price",
                },
              ]}
            >
              <Input></Input>
            </Form.Item>
          </Col>
        </Row>
        <div className="alladdmedbutton">
          <Button
            className="recheckmedicinebutton"
            onClick={() => navigate("/medicine-and-regimen")}
          >
            Back
          </Button>
          <div className="returnmedicinebutton1">
            <Button htmlType="submit" className="recheckmedicinebutton">
              Complete
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default AddNewMedicine;
