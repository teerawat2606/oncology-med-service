import { useEffect, useState } from "react";
import "./box.css";
import { useLocation } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Radio,
  Row,
  Col,
  Button,
  InputNumber,
} from "antd";
import { patient, userApi } from "../../api";
import { useNavigate } from "react-router";
import { Gender } from "../../enums";

type FieldType = {
  doctorId?: number;
  HN?: number;
  name?: string;
  gender?: string;
  age?: number;
  BW?: number;
  Ht?: number;
  sCr?: number;
};

export type DoctorData = {
  id: string;
  name: string;
};

const Box: React.FC = () => {
  const { pathname } = useLocation();
  console.log(pathname);
  const [allDoctorData, setAllDoctorData] = useState<DoctorData[]>([]);
  const navigate = useNavigate();
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleOpenCycle = async (values: any) => {
    try {
      const res = await patient.postPatientData(
        values.doctorId,
        values.HN,
        values.name,
        values.gender,
        values.age,
        values.BW,
        values.Ht,
        values.sCr
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
      try {
        const response = await userApi.getDoctorInfo();
        if (response !== undefined) {
          setAllDoctorData(response);
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
    <div className="table-container-open">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={handleOpenCycle}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div>
          <h2>Patient information</h2>
        </div>
        <div className="container">
          <div className="pattient-information">
            <Col span={8}>
              <Form.Item<FieldType>
                name="HN"
                label="Hospital number"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="gender"
                label="Gender"
                className="radio"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio value={Gender.MALE}> Male </Radio>
                  <Radio value={Gender.FEMALE}> Female</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                name="name"
                label="Patient name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<FieldType>
                name="doctorId"
                label="Doctor's name"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  style={{ width: 120 }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={allDoctorData.map((doctor) => ({
                    value: doctor.id,
                    label: doctor.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Row>
              <Col span={4}>
                <Form.Item<FieldType>
                  name="age"
                  label="Age"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item<FieldType>
                  name="BW"
                  label="BW (kg)"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item<FieldType>
                  name="Ht"
                  label="Ht (cm)"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item<FieldType>
                  name="sCr"
                  label="sCr (mg/dL)"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
        <div className="allopencyclebutton">
          <Form.Item>
            <Button
              onClick={() => navigate("/homepage")}
              className="submit-button5"
            >
              Back
            </Button>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" className="submit-button5">
              Complete
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default Box;
