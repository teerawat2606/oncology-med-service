import { useState, useEffect } from "react";
import { cycleApi } from "../../api";
import { useNavigate, useParams } from "react-router";

import React from "react";
import { AllCycleByCase, RecheckMedicineData } from "../../interfaces";

import "./index.css";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Flex,
  Form,
  Popconfirm,
  Row,
  message,
} from "antd";
import CycleDetails from "../../interfaces/CycleDetails";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const CycleDetailss = () => {
  const { cycleId } = useParams();
  const navigate = useNavigate();
  const cancel = () => {
    message.error("Click on No");
  };
  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY-MM-DD";
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const saveAppointment = async (values: any) => {
    console.log(values["appointmentDate"].format(dateFormat));

    try {
      const res = await cycleApi.patchReschedule(
        cycleId,
        values["appointmentDate"].format(dateFormat)
      );
      const result = await res.json();
      navigate(`/cycledetails/${cycleId}`, { replace: true });
      message.success("AppointmentDate was updated");
      console.log("Success:", result);
      console.log(values);
    } catch (error) {
      console.error("Error:", error);
      message.error("Save AppointmentDate was failed");
    }
  };
  const confirm = async (cycleId: number) => {
    try {
      const res = await cycleApi.cancelCycle(cycleId);
      const result = await res.json();
      console.log(result);
      message.success("Cycle deleted successfully");
      navigate(`/allcycle/${cycleData?.caseId}`);
    } catch (error) {
      console.error("Error deleting bottle:", error);
      message.error("Failed to delete bottle");
    }
  };

  //   const onChange: DatePickerProps["onChange"] = (date, dateString) => {
  //     console.log(date, dateString);
  //   };
  const [cycleData, setCycleData] = useState<CycleDetails>();
  const [usage, setUsage] = useState<RecheckMedicineData>();
  console.log(cycleData?.appointmentDate);
  useEffect(() => {
    const fetchData = async () => {
      const cycle = await cycleApi.getCycleDetails(Number(cycleId));
      setCycleData(cycle);
      try {
        const usage = await cycleApi.getRecheckMedicine(Number(cycleId));
        if (usage != null) {
          setUsage(usage);
          console.log(usage);
        }
      } catch (error) {
        console.error("Error fetching cost data:", error);
      }
    };

    fetchData();
  }, [cycleId]);

  return cycleData ? (
    <div className="page-container">
      <div className="table-containerrr">
        <Form
          name="appointment"
          initialValues={{ remember: true }}
          onFinish={saveAppointment}
          autoComplete="off"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "calc(100vh - 140px)",
          }}
        >
          <div className="flexfordetail">
            <div className="casedetail">
              <Row className="cycledetailstext">
                <Col className="cycledetailstext" span={4}>
                  Patient HN
                </Col>
                <Col className="cycledetailstext" span={4}>
                  {cycleData?.patient.HN}
                </Col>
                <Col span={16}>
                  <Flex justify="flex-end">
                    <Popconfirm
                      title="Cancel Cycle"
                      description="Are you sure to cancel this cycle?"
                      onConfirm={() => confirm(Number(cycleId))}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>Cancel cycle</Button>
                    </Popconfirm>
                  </Flex>
                </Col>
              </Row>
              <Row className="cycledetailstext">
                <Col className="cycledetailstext" span={4}>
                  Patient Name
                </Col>
                <Col className="cycledetailstext" span={4}>
                  {cycleData?.patient.HN}
                </Col>
                <Col span={16}>
                  <Flex justify="flex-end" gap={16}>
                    <Col className="cycledetailstext">Reservation Date</Col>
                    <Form.Item name={"appointmentDate"}>
                      <DatePicker
                        onChange={onChange}
                        defaultValue={dayjs(
                          cycleData.appointmentDate
                            ? cycleData.appointmentDate
                            : undefined
                        )}
                        //   defaultValue={dayjs(cycleData.appointmentDate)}
                        format={dateFormat}
                      />
                    </Form.Item>
                  </Flex>
                </Col>
              </Row>
              <Row className="cycledetailstext">
                <Col className="cycledetailstext" span={4}>
                  Gender
                </Col>
                <Col className="cycledetailstext" span={4}>
                  {cycleData?.patient.gender}
                </Col>
              </Row>
              <Row className="cycledetailstext">
                <Col className="cycledetailstext" span={4}>
                  Doctor
                </Col>
                <Col className="cycledetailstext" span={4}>
                  {cycleData?.doctorName}
                </Col>
              </Row>
              <Row className="cycledetailstext">
                <Col
                  span={4}
                  className="cycledetailstext"
                >{`Age : ${cycleData?.patient.age}`}</Col>
                <Col
                  span={4}
                  className="cycledetailstext"
                >{`BW(kg) : ${cycleData?.patient.BW}`}</Col>
                <Col
                  span={4}
                  className="cycledetailstext"
                >{`Ht(cm) : ${cycleData?.patient.Ht}`}</Col>
                <Col
                  span={4}
                  className="cycledetailstext"
                >{`SCr(mg/dL) : ${cycleData?.patient.sCr}`}</Col>
              </Row>
            </div>
            <div className="casedetail">
              <h1>Usage Summary</h1>
              {/* {"Usage Summary"} */}
              {/* <tbody> */}
              {usage?.formulas.map(
                (
                  { drug, formulaQuantity, formulaUnit, doctorQuantity },
                  index
                ) => (
                  // <tr className="recheckmedicinerow" key={index}>
                  //   <td className="cycledetailstext">{`${drug.name} ${formulaQuantity} ${formulaUnit}`}</td>
                  //   <td className="cycledetailstext">
                  //     {doctorQuantity.toFixed(2)}
                  //   </td>
                  // </tr>
                  <Row className="cycledetailstext">
                    <Col
                      span={4}
                      className="cycledetailstext"
                    >{`${drug.name} ${formulaQuantity} ${formulaUnit}`}</Col>
                    <Col span={4} className="cycledetailstext">
                      {`${doctorQuantity.toFixed(2)} mg`}
                    </Col>
                  </Row>
                )
              )}
              {/* </tbody> */}
            </div>
          </div>
          <div className="allcycledetailsbutton">
            <div className="recheckmedicinebutton1">
              <Button
                htmlType="submit"
                className="recheckmedicinebutton"
                onClick={() => navigate(`/allcycle/${cycleData?.caseId}`)}
              >
                Back
              </Button>
            </div>
            <div className="recheckmedicinebutton1">
              <Button htmlType="submit" className="recheckmedicinebutton">
                Save
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default CycleDetailss;
