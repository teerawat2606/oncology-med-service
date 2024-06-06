import { Button, Checkbox, Col, Form, Select } from "antd";
import React, { SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import RecieveCycleData from "../../../interfaces/RecieveCycleData";
import RecieveRegimenData from "../../../interfaces/RecieveRegimenData";
import "./cycle-overview.css";
//import getCycleInfo from "../../../api/cycleinfo";
import { Emercheck, UpdatedRegimenDetail } from "."; //is it right?

export interface selectedRegimenId {
  regimenId: number;
}

interface FieldType {
  emer?: boolean; // Assuming 'emer' is a boolean field
}

interface Props {
  CycleData: RecieveCycleData;
  allRegimenData: RecieveRegimenData[] | undefined;
  setCycleData: React.Dispatch<SetStateAction<RecieveCycleData | undefined>>;
  setAllRegimenData: React.Dispatch<SetStateAction<RecieveRegimenData[]>>;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  selectedRegimenId: selectedRegimenId | undefined;
  setSelectedRegimenId: React.Dispatch<
    SetStateAction<selectedRegimenId | undefined>
  >;
  setUpdatedRegimenDetail: React.Dispatch<
    SetStateAction<UpdatedRegimenDetail | undefined>
  >;
  setEmercheck: React.Dispatch<SetStateAction<Emercheck | undefined>>;
}

const DoctorCycleOverview: React.FC<Props> = ({
  CycleData,
  allRegimenData,
  setCycleData,
  setAllRegimenData,
  setTab,
  selectedRegimenId,
  setSelectedRegimenId,
  setUpdatedRegimenDetail,
  setEmercheck,
}) => {
  const onFinish = (values: any) => {
    console.log(values.RegimenId);
    //setSelectedRegimenId({regimenId: values.RegimenId})

    // Check if there is an id present in CycleData.regimen
    if (CycleData && CycleData.regimen && CycleData.regimen.id) {
      // Set from CycleData if present
      setSelectedRegimenId({ regimenId: CycleData.regimen.id });
    } else if (values.RegimenId) {
      // Set from form values if selected from dropdown
      setSelectedRegimenId({ regimenId: values.RegimenId });
    }

    //console.log(values.emerstatus)
    setEmercheck({ isEmer: values.emer || false });
    setTab("2");
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: number }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  /*for checkbox*/
  const [isChecked, setChecked] = useState(false);
  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  console.log({ CycleData });
  return (
    <div className="box-cycleoverview">
      <Form
        name="regiselectandemercheck"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {/* ส่วนที่แสดง */}
        <div className="patient-information">
          <h1>Patient information</h1>
          <div className="containerleftright">
            <ul className="left">
              <li>Patient HN</li>
              <li>Patient Name</li>
              <li>Gender</li>
            </ul>

            {/* ค่าที่แสดง */}
            <ul className="right">
              <li>{CycleData?.patient.HN}</li>
              <li>{CycleData?.patient.name}</li>
              <li>{CycleData?.patient.gender}</li>
            </ul>
          </div>

          <div className="patient99">
            <div className="short-container">
              <p>Age : </p>
              <li>{CycleData?.patient.age} </li> {/* ค่าที่แสดง */}
            </div>
            <div className="short-container">
              <p>Bw(kg) : </p>
              <li>{CycleData?.patient.BW} </li> {/* ค่าที่แสดง */}
            </div>
            <div className="short-container">
              <p>Ht(cm) : </p>
              <li>{CycleData?.patient.Ht} </li> {/* ค่าที่แสดง */}
            </div>
            <div className="short-container">
              <p>sCr(mg/dL) : </p>
              <li>{CycleData?.patient.sCr} </li> {/* ค่าที่แสดง */}
            </div>
          </div>
          <div>
            <div className="regimen-selection">
              {CycleData.regimen ? (
                <div className="regidata">
                  <p>Regimen Name : {CycleData.regimen.name}</p>
                </div>
              ) : (
                <Col
                  span={8}
                  style={{ display: "flex", justifyContent: "start" }}
                >
                  <Form.Item
                    name="RegimenId"
                    label={
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          color: "#00104f",
                          display: "block",
                          width: "80%",
                          textAlign: "left",
                          maxHeight: "40px",
                        }}
                      >
                        Regimen
                      </span>
                    }
                    rules={[{ required: true }]}
                  >
                    <Select
                      showSearch
                      style={{ width: 240, textAlign: "left" }}
                      placeholder="Select a regimen"
                      optionFilterProp="children"
                      filterOption={filterOption}
                      options={allRegimenData?.map((regimenlist) => ({
                        value: regimenlist.id,
                        label: regimenlist.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
              )}
            </div>
          </div>
        </div>

        <label className="emer">
          <Col span={2}>
            <Form.Item<FieldType>
              name={"emer"}
              valuePropName="checked"
              wrapperCol={{ span: 16 }}
            >
              <Checkbox
                name={"emerstatus"}
                style={{ fontSize: "16px", color: "#00104f" }}
              >
                Emergency
              </Checkbox>
            </Form.Item>
          </Col>
        </label>
        <div className="two-buttonforcycleoverview">
          <Link className="recheckmedicinebutton" to="/homepage">
            Back
          </Link>

          <Button htmlType="submit" className="recheckmedicinebutton">
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DoctorCycleOverview;
