import { Button, Col, Form, Input, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { drugApi } from "../../../api";

export type DrugData = {
  id: string;
  name: string;
};

function AddBottle() {
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    console.log(values);
    try {
      const res = await drugApi.postBottle(
        values["drugId"],
        values["bottleName"],
        values["bottlePrice"]
      );
      const result = await res.json();

      navigate("/add-med", { replace: true });

      window.location.reload();
      console.log("Success:", result);
      console.log(values);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [allDrugData, setAllDrugData] = useState<DrugData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await drugApi.getDrugInfo();
        if (response !== undefined) {
          setAllDrugData(response);
        } else {
          console.error("Response is undefined");
        }
      } catch (error) {
        console.error("Error fetching drug data:", error);
      }
    };

    fetchData();
  }, []);
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div>
      <Form
        name="recheckmedicine"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Col span={8}>
          <Form.Item
            name="drugId"
            label="Drug name"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              style={{ width: 120 }}
              placeholder="Select a person"
              optionFilterProp="children"
              filterOption={filterOption}
              options={allDrugData.map((drug) => ({
                value: drug.id,
                label: drug.name,
              }))}
            />
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
          <div className="returnmedicinebutton1">
            <Button
              className="recheckmedicinebutton"
              onClick={() => navigate("/medicine-and-regimen")}
            >
              Back
            </Button>
          </div>
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

export default AddBottle;
