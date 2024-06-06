import { useEffect, useState } from "react";
import "./box.css";
import {
  Outlet,
  Link,
  useLocation,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Button, DatePicker, Form } from "antd";
import { Appointment } from "../../../interfaces/appointment";
import { cycleApi } from "../../../api";

type FieldType = {
  appointmentDate: Date;
};

const linkArr = [
  {
    name: "Back",
    path: "/backtohome",
  },
  {
    name: "Complete",
    path: "/cyclecycles",
    // น่าจะต้องมี confirm add หรือมี notice ว่า confirm แล้ว
  },
];

const Box: React.FC = () => {
  const { pathname } = useLocation();
  console.log(pathname);
  const navigate = useNavigate();
  const { cycleId } = useParams();
  const [appointmentData, setAppointmentData] = useState<
    Appointment | undefined
  >();

  const dateFormat = "YYYY-MM-DD";

  useEffect(() => {
    const fetchData = async () => {
      if (cycleId) {
        try {
          const ASummary = await cycleApi.getAppointment(+cycleId);
          if (ASummary != null) {
            setAppointmentData(ASummary);
            console.log(appointmentData);
          }
        } catch (error) {
          console.error("Error fetching patient data:", error);
        }
      }
    };

    fetchData();
  }, [cycleId]);

  const handleMakeAppointment = async (values: any) => {
    if (cycleId)
      try {
        const res = await cycleApi.makeAppointment(
          values["appointmentDate"].format(dateFormat),
          +cycleId
        );
        // const result = await res.json();
        // res.json ทำใน cycleAPI ไปละ
        navigate("/homepage", { replace: true });

        // console.log("Success:", result);
        console.log(values);
      } catch (error) {
        console.error("Error:", error);
      }
  };

  console.log(appointmentData);
  return (
    <div className="box-appointment">
      <Form
        name="appointment"
        initialValues={{ remember: true }}
        onFinish={handleMakeAppointment}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div className="patient-information">
          <h4 className="message">
            * If you did not recieve an email, please click back *
          </h4>
          <div className="first-box">
            <h3 className="headline">Patient Detail</h3>
            <div className="con1">
              <h4>{appointmentData?.patient?.name}</h4>
              <h4>{appointmentData?.patient?.HN}</h4>
              <h4>Regimen: {appointmentData?.regimenName}</h4>
              <h4>Doctor: {appointmentData?.doctorName}</h4>
            </div>
          </div>
          <div className="second-box">
            <h3 className="headline">Appointment date</h3>
            <div className="con">
              <h6>Reservation Date</h6>
              <Form.Item<FieldType>
                name="appointmentDate"
                rules={[{ required: true }]}
              >
                <DatePicker></DatePicker>
              </Form.Item>
            </div>
          </div>
        </div>
        {/* <div className="two-button-appointment">
        {linkArr.map((link) => (
          <Link
            to={link.path}
            className={`button-color ${
              pathname === link.path ? "link-selected" : "link-normal"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div> */}
        <div className="two-button-appointment">
          <Form.Item>
            <Button
              className="submit-button5"
              onClick={() => navigate("/homepage")}
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
