import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Button, Calendar, ConfigProvider } from "antd";
import "./index.css";
import CycleByMonth from "../../interfaces/CycleByMonth";
import { calendarApi } from "../../api";
import { NavigateFunction, useNavigate } from "react-router-dom";

const getListData = (
  value: Dayjs,
  appointments: CycleByMonth[],
  navigate: NavigateFunction
) => {
  // let listData: any;
  // console.log(value.date());

  const listDate = appointments.filter(
    (appointment) =>
      parseInt(appointment.date.split("-")[2]) === value.date() &&
      parseInt(appointment.date.split("-")[1]) === value.month() + 1
  );
  // // console.log(listDate);
  // console.log(listDate);
  const listData = listDate.flatMap((date) =>
    date.cycles.map((cycle) => ({
      type: "",
      content: (
        <Button
          htmlType="submit"
          className="cyclelink"
          onClick={() => navigate(`/cycledetails/${cycle.id}`)}
        >
          {cycle.patientName}
        </Button>
      ),
    }))
  );

  return listData || [];
};

// const getMonthData = (value: Dayjs) => {
//   if (value.month() === 8) {
//     return 1394;
//   }
// };

const AppointmentCalendar: React.FC = () => {
  // call get here
  console.log();
  const [appointments, setAppointments] = useState<
    CycleByMonth[] | undefined
  >();
  const navigate = useNavigate();
  // const monthCellRender = (value: Dayjs) => {
  //   const num = getMonthData(value);
  //   return num ? (
  //     <div>
  //       <section>{num}</section>
  //       <span>Backlog number</span>
  //     </div>
  //   ) : null;
  // };
  useEffect(() => {
    onPanelChange(dayjs());
  }, []);

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value, appointments || [], navigate);
    // console.log(`${listData}${value.date()}`);
    console.log(listData);
    return (
      <ul className="events">
        {listData.map((item: any, i) => (
          <li key={i}>
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    // if (info.type === "month") return monthCellRender(current);
    // return info.originNode;
  };

  const onPanelChange = async (value: Dayjs | null) => {
    if (value) {
      try {
        const allAppointments = await calendarApi.getCycleByMonth(
          value.month() + 1,
          value.year()
        );
        setAppointments(allAppointments);
        console.log(allAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    }
  };
  return (
    <div className="page-container">
      <div className="calendar-container">
        <ConfigProvider
          theme={{
            token: {
              // Seed Token
              colorPrimary: "#A9A9A9",
              borderRadius: 2,

              // Alias Token
              colorBgContainer: "#eee",
            },
          }}
        >
          <Calendar cellRender={cellRender} onPanelChange={onPanelChange} />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
