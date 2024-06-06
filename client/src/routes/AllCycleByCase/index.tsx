import { useState, useEffect } from "react";
import { cycleApi } from "../../api";
import { useNavigate, useParams } from "react-router";

import React from "react";
import { AllCycleByCase } from "../../interfaces";

import "./index.css";
import { Button, InputNumber, Modal, Popconfirm, Row, message } from "antd";

const AllCycle = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [allCaseData, setAllCaseData] = useState<AllCycleByCase[]>();
  const [ageValue, setAgeValue] = useState<number | undefined>(0);
  const [heightValue, setHeightValue] = useState<number | undefined>(0);
  const [weightValue, setWeightValue] = useState<number | undefined>(0);
  const [scrValue, setScrValue] = useState<number | undefined>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const cancel = (event?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleOk = async () => {
    try {
      console.log(ageValue);
      console.log(heightValue);
      console.log(weightValue);
      console.log(scrValue);
      const res = await cycleApi.postNewCycle(Number(caseId), {
        age: ageValue,
        Ht: heightValue,
        BW: weightValue,
        sCr: scrValue,
      });
      const result = await res.json();
      message.success("New cycle created successfully");
      // navigate("/medicine-and-regimen", { replace: true });
      // window.location.reload();
    } catch (error) {
      console.error("Error creating new cycle", error);
      message.error("Failed to create new cycle");
    }
  };
  // const confirm = async (caseId: number) => {
  //   try {
  //     const res = await cycleApi.postNewCycle(caseId);
  //     const result = await res.json();
  //     message.success("New cycle created successfully");
  //     navigate(`/allcycle/${caseId}`, { replace: true });
  //   } catch (error) {
  //     console.error("Error deleting bottle:", error);
  //     message.error("Failed to delete bottle");
  //   }
  // };
  const confirmdelete = async (id: number) => {
    try {
      const res = await cycleApi.deleteCycle(id);
      const result = await res.json();
      message.success("Cycle deleted successfully");
      navigate(`/all-patient`, { replace: true });
    } catch (error) {
      console.error("Error deleting bottle:", error);
      message.error("Failed to delete cycle");
    }
  };

  //   const onChange: DatePickerProps["onChange"] = (date, dateString) => {
  //     console.log(date, dateString);
  //   };

  //   const onFinish = async (values: any) => {
  //     console.log(values);

  //     try {
  //       const res = await cycleApi.patchInventory(
  //         cycleId,
  //         values["inventoryPRnumber"],
  //         values["inventoryPRdate"],
  //         inventoryData?.drugs?.flatMap((drug: any) =>
  //           drug.bottles.map((bottle: any) => ({
  //             id: bottle.id,
  //             purchase: values[`purchase_${bottle.id}`],
  //           }))
  //         ) as [{ id: number; purchase: number }],
  //         values["inventoryNote"]
  //       );
  //       console.log(
  //         inventoryData?.drugs?.flatMap((drug: any) =>
  //           drug.bottles.map((bottle: any) => ({
  //             id: bottle.id,
  //             purchase: values[`purchase_${bottle.id}`],
  //           }))
  //         )
  //       );

  //       console.log(await res.json());
  //       const result = await res.json();
  //       navigate("/homepage", { replace: true });
  //       console.log("Success:", result);
  //       console.log(values);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    const fetchData = async () => {
      const allCase = await cycleApi.getAllCycle(Number(caseId));
      setAllCaseData(allCase);
      console.log(allCase);
    };
    fetchData();
  }, [caseId]);

  return (
    <div className="page-container">
      <div className="table-container-cyclebycase">
        <div className="casedetail">
          <h2>Patient's Detail</h2>
          <h3>{allCaseData?.[0].patientName}</h3>
          <h3>{`HN : ${allCaseData?.[0].patientHN}`}</h3>
          <h3>{`Regimen : ${allCaseData?.[0].regimenName} (total cycles = ${allCaseData?.[0].totalCycles})`}</h3>
          <h3>{allCaseData?.[0].doctorName}</h3>
        </div>
        <div className="cycledetails">
          <Row className="spacebetween" align="top">
            <div className="appointment">Appointment</div>

            {/* <Popconfirm
              title="Create new cycle"
              description="Are you sure to create a new cycle?"
              onConfirm={() => confirm(Number(caseId))}
              onCancel={(e) => cancel(e)} // Pass the event to cancel function
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Create new cycle</Button>
            </Popconfirm> */}
            <Button
              className="editbutton"
              type="primary"
              onClick={() => handleModalOpen()}
            >
              Create new Cycle
            </Button>
            <Modal
              title="Create new cycle"
              open={modalOpen}
              onOk={() => handleOk()}
              onCancel={() => handleModalClose()}
            >
              <p>{`Age`}</p>
              <InputNumber
                name="Age"
                value={ageValue}
                onChange={(value) => setAgeValue(value || undefined)}
              />
              <p>{`Height (cm)`}</p>
              <InputNumber
                name="height"
                value={heightValue}
                onChange={(value) => setHeightValue(value || undefined)}
              />
              <p>{`Weight (kg)`}</p>
              <InputNumber
                name="Weight"
                value={weightValue}
                onChange={(value) => setWeightValue(value || undefined)}
              />
              <p>{`sCr (mg/dL)`}</p>
              <InputNumber
                name="sCr"
                value={scrValue}
                onChange={(value) => setScrValue(value || undefined)}
              />
            </Modal>
          </Row>
          <table className="allpatienttable">
            <thead>
              <tr className="allpatientrow">
                <th className="allpatientheader">Cycle Number</th>
                <th className="allpatientheader">Hospital number</th>
                <th className="allpatientheader">Patient's name</th>
                <th className="allpatientheader">Reservation Date</th>
                <th className="allpatientheader">Status</th>
                <th className="allpatientheader">Action</th>
              </tr>
            </thead>
            <tbody>
              {allCaseData?.map(
                (
                  {
                    id,
                    cycleNumber,
                    patientHN,
                    patientName,
                    status,
                    appointmentDate,
                  },
                  index
                ) => (
                  <tr
                    className="allpatientrow"
                    key={index}
                    onClick={(event) => {
                      const deleteButtonClicked = (
                        event.target as HTMLElement
                      ).className.includes("ant-btn-danger");
                      if (!deleteButtonClicked) {
                        navigate(`/cycledetails/${id}`);
                      }
                    }}
                  >
                    <td className="allpatientbody">{cycleNumber}</td>
                    <td className="allpatientbody">{patientHN}</td>
                    <td className="allpatientbody">{patientName}</td>
                    <td className="allpatientbody">{appointmentDate}</td>
                    <td className="allpatientbody">{status}</td>
                    <td className="allpatientbody">
                      {status === "cancel" && (
                        <Popconfirm
                          title="Delete the cycle"
                          description="Are you sure to delete this cycle?"
                          onConfirm={() => confirmdelete(id)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button danger onClick={(e) => e.stopPropagation()}>
                            Delete
                          </Button>
                        </Popconfirm>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        <div className="allrecheckmedicinebutton">
          <div className="recheckmedicinebutton2">
            <Button
              htmlType="submit"
              className="recheckmedicinebutton"
              onClick={() => navigate(`/all-patient`)}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCycle;
