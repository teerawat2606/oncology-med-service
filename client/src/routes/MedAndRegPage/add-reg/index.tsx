import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Space,
  Select,
  InputNumber,
  Row,
  Col,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { DrugData } from "../add-med/existedmedicine";
import { drugApi, regimenApi } from "../../../api";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import "./index.css";

const App: React.FC = () => {
  const onFinish = async (values: any) => {
    console.log("Received values:", values);
    try {
      const res = await regimenApi.postRegimen(
        values["regimenName"],
        values["note"],
        values["remark"],
        values["medication"],
        values["premed"],
        values["homemed"],
        [
          {
            usage: "Day1",
            formulas: values["Day1"],
          },
          {
            usage: "Day2",
            formulas: values["Day2"],
          },
        ]
      );
      const result = await res.json();
      console.log(
        values["regimenName"],
        values["note"],
        values["remark"],
        values["medication"],
        values["premed"],
        values["homemed"],
        {
          day1: values["Day1"],
          day2: values["Day2"],
        }
      );

      navigate("/add-reg", { replace: true });
      window.location.reload();
      console.log("Success:", result);
      console.log(values);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const navigate = useNavigate();
  const onChanges = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log("Change:", e.target.value);
  };
  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value: string) => {
    console.log("search:", value);
  };
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
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
  return (
    <div className="page-container">
      <div className="addregimen-container">
        <h2>Add Regimen</h2>
        <Form
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
        >
          <div className="add-regimen">
            <Col span={12}>
              <Form.Item
                name="regimenName"
                rules={[
                  {
                    required: true,
                    message: "Please put Regimen name!",
                  },
                ]}
              >
                <Input
                  className="regimenname"
                  placeholder="Regimen name"
                  size="large"
                />
              </Form.Item>
            </Col>
            <h2>Chemotheraphy</h2>
            <h3>Day1</h3>
            <Form.List name="Day1">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    // <Space
                    //   key={key}
                    //   style={{ display: "flex", marginBottom: 8 }}
                    //   align="baseline"
                    // >
                    <Row gutter={10}>
                      <Col span={5}>
                        <Form.Item
                          {...restField}
                          name={[name, "drugId"]}
                          rules={[
                            { required: true, message: "Missing Drug name" },
                          ]}
                        >
                          <Select
                            showSearch
                            placeholder="Select medicine"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            options={allDrugData.map((drug) => ({
                              value: drug.id,
                              label: drug.name,
                            }))}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, "formulaQuantity"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing formula quantity",
                            },
                          ]}
                        >
                          <InputNumber placeholder="formula quantity" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, "formulaUnit"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing formula unit",
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            placeholder="Select formula unit"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={[
                              {
                                value: "mg/kg",
                                label: "mg/kg",
                              },
                              {
                                value: "mg/m2",
                                label: "mg/m2",
                              },
                              {
                                value: "AUC5",
                                label: "AUC5",
                              },
                              {
                                value: "mg",
                                label: "mg",
                              },
                            ]}
                          />
                        </Form.Item>
                      </Col>

                      <Col>+</Col>
                      <Col span={9}>
                        <Form.Item
                          {...restField}
                          name={[name, "diluteDescription"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing Dilute description",
                            },
                          ]}
                        >
                          <Input placeholder="Dilute description" />
                        </Form.Item>
                      </Col>
                      <Col>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                    // </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add formula for Day 1
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <h3>Day2</h3>
            <Form.List name="Day2">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    // <Space
                    //   key={key}
                    //   style={{ display: "flex", marginBottom: 8 }}
                    //   align="baseline"
                    // >
                    <Row gutter={10}>
                      <Col span={5}>
                        <Form.Item
                          {...restField}
                          name={[name, "drugId"]}
                          rules={[
                            { required: true, message: "Missing Drug name" },
                          ]}
                        >
                          <Select
                            showSearch
                            placeholder="Select medicine"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            options={allDrugData.map((drug) => ({
                              value: drug.id,
                              label: drug.name,
                            }))}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, "formulaQuantity"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing formula quantity",
                            },
                          ]}
                        >
                          <InputNumber placeholder="formula quantity" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, "formulaUnit"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing formula unit",
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            placeholder="Select formula unit"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={[
                              {
                                value: "mg/kg",
                                label: "mg/kg",
                              },
                              {
                                value: "mg/m2",
                                label: "mg/m2",
                              },
                              {
                                value: "AUC5",
                                label: "AUC5",
                              },
                              {
                                value: "mg",
                                label: "mg",
                              },
                            ]}
                          />
                        </Form.Item>
                      </Col>

                      <Col>+</Col>
                      <Col span={9}>
                        <Form.Item
                          {...restField}
                          name={[name, "diluteDescription"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing Dilute description",
                            },
                          ]}
                        >
                          <Input placeholder="Dilute description" />
                        </Form.Item>
                      </Col>
                      <Col>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                    // </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add formula for Day 2
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item name="note" label="Note">
              <TextArea
                showCount
                maxLength={100}
                onChange={onChanges}
                placeholder="Note Area"
                style={{
                  height: 120,
                  width: "calc(100vw - 670px)",
                  resize: "none",
                  float: "right",
                }}
              />
            </Form.Item>
            <Form.Item name="premed" label="Pre-medication">
              <TextArea
                showCount
                maxLength={100}
                onChange={onChanges}
                placeholder="Pre-medication"
                style={{
                  height: 120,
                  width: "calc(100vw - 670px)",
                  resize: "none",
                  float: "right",
                }}
              />
            </Form.Item>
            <Form.Item name="remark" label="Remark">
              <TextArea
                showCount
                maxLength={100}
                onChange={onChanges}
                placeholder="Remark Area"
                style={{
                  height: 120,
                  width: "calc(100vw - 670px)",
                  resize: "none",
                  float: "right",
                }}
              />
            </Form.Item>
            <Form.Item name="medication" label="Medication">
              <TextArea
                showCount
                maxLength={100}
                onChange={onChanges}
                placeholder="Medication Area"
                style={{
                  height: 120,
                  width: "calc(100vw - 670px)",
                  resize: "none",
                  float: "right",
                }}
              />
            </Form.Item>
            <Form.Item name="homemed" label="Home-medicine">
              <TextArea
                showCount
                maxLength={100}
                onChange={onChanges}
                placeholder="Home-medicine Area"
                style={{
                  height: 120,
                  width: "calc(100vw - 670px)",
                  resize: "none",
                  float: "right",
                }}
              />
            </Form.Item>
          </div>
          <Form.Item>
            <div className="alladdregbutton">
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
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default App;
