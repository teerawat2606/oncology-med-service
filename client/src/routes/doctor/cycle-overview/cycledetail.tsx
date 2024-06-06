import "./cycledetail.css";
import React, { useEffect, useState, SetStateAction } from "react";
// import "./cycle-overview.css";
import { Button, Form, Input, Col, Checkbox } from "antd";
//lสำหรับข้อมูลผู้ป่วย
import RecieveCycleData from "../../../interfaces/RecieveCycleData";
//สำหรับข้อมูล regimen ทั้งหมด
import regimeninfo from "../../../api/regimenlist";
//import getCycleInfo from "../../../../api/cycleinfo";
import TextArea from "antd/es/input/TextArea";
import { UpdatedRegimenDetail } from ".";
import { drugApi } from "../../../api";

//get selected regimen detail
import RecieveRegimenDetailData from "../../../interfaces/RecieveRegimenDetailData";

export interface selectedRegimenId {
  regimenId: number;
}

export interface DrugData {
  id: string;
  name: string;
}

type FieldType = {
  premedNote: string;
  medicationNote: string;
  remarkNote: string;
  Note: string;
  homemedNote: string;
  totalcycle: number;
  doctorAmount: number;
  quantity: number;
  usage: string;
  id: number;
  isInsurance: boolean;
};

type formula = {
  id: string;
  quantity: number;
  usage: string;
};

interface Props {
  CycleData: RecieveCycleData; //ข้อมูลเคส
  setUpdatedRegimenDetail: React.Dispatch<
    SetStateAction<UpdatedRegimenDetail | undefined>
  >;
  updatedRegimenDetail: UpdatedRegimenDetail | undefined;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  selectedRegimenId: selectedRegimenId | undefined; //เอามาไว้เรียก regimen id ที่เลือกจากหน้า 1
}

const DoctorCycleDetail: React.FC<Props> = ({
  CycleData,
  setTab,
  selectedRegimenId,
  updatedRegimenDetail,
  setUpdatedRegimenDetail,
}) => {
  const [selectedRegimenDetail, setSelectedRegimenDetail] =
    useState<RecieveRegimenDetailData>();
  const [drugs, setDrugs] = useState<DrugData[] | undefined>([]);
  //data for add in textarea
  const [premedtext, setpremedText] = useState("");
  const [remarktext, setremarkText] = useState("");
  const [medicationtext, setmedicationText] = useState("");
  const [homemedtext, sethomemedText] = useState("");
  const [isTotalCyclesEditable, setIsTotalCyclesEditable] = useState(
    CycleData.totalCycles === null
  );

  const [hasFetched, setHasFetched] = useState(false);
  useEffect(() => {
    // If the selected regimen ID is defined and the details haven't been fetched yet, fetch the data
    if (selectedRegimenId && !hasFetched) {
      const fetchData = async () => {
        try {
          console.log(
            "Fetching data for regimen ID:",
            selectedRegimenId.regimenId
          );
          const regimenDetail = await regimeninfo.getRegimenDetailInfo(
            Number(selectedRegimenId.regimenId)
          );
          const Drugdata = await drugApi.getDrugInfo();

          // Assuming the API returns an array and we're interested in the first item
          if (regimenDetail && regimenDetail.length > 0) {
            setSelectedRegimenDetail(regimenDetail[0]);
          }
          setDrugs(Drugdata);
          setHasFetched(true);
        } catch (error) {
          // Handle errors, e.g., by setting an error state or logging
          console.error("Failed to fetch regimen detail:", error);
        }
      };

      fetchData();
    }
  }, [selectedRegimenId, selectedRegimenDetail]);

  console.log(selectedRegimenDetail);
  const [form] = Form.useForm();

  const [hasFetched2, setHasFetched2] = useState(false);
  useEffect(() => {
    if (selectedRegimenId && !hasFetched2) {
      const fetchData2 = async () => {
        // Fetching the selected regimen detail
        const detail = await regimeninfo.getRegimenDetailInfo(
          Number(selectedRegimenId.regimenId)
        );
        if (detail) {
          // Assuming detail[0] contains the regimen detail you're interested in
          const sortedFormulas = detail[0].regimenFormulas.sort((a, b) => {
            // Extracting day numbers from the usage strings
            const dayA = parseInt(a.usage.replace(/\D/g, ""), 10);
            const dayB = parseInt(b.usage.replace(/\D/g, ""), 10);
            return dayA - dayB;
          });
          // Setting the sorted formulas back to the regimen detail
          const updatedDetail = {
            ...detail[0],
            regimenFormulas: sortedFormulas,
          };
          setSelectedRegimenDetail(updatedDetail);

          const formData = updatedRegimenDetail
            ? {
                // Use updatedRegimenDetail data if available
                premedNote: updatedRegimenDetail.preMedication,
                remarkNote: updatedRegimenDetail.regimenRemark,
                medicationNote: updatedRegimenDetail.regimenMedication,
                homemedNote: updatedRegimenDetail.regimenHomeMedication,
                totalcycle: updatedRegimenDetail.totalCycles, // Ensure this field exists in UpdatedRegimenDetail
                // Add other necessary fields from updatedRegimenDetail here
              }
            : {
                // Fallback to selectedRegimenDetail data
                premedNote: updatedDetail.premedication,
                remarkNote: updatedDetail.remark,
                medicationNote: updatedDetail.medication,
                homemedNote: updatedDetail.homeMed,
                Note: updatedDetail.note, // Assuming there's a note field in your detail
                // You might need to handle the total cycles field here too, depending on your structure
              };
          // Set the form values
          form.setFieldsValue(formData);
          setHasFetched2(true);
        }
      };
      fetchData2();
    }
  }, [selectedRegimenId, form, hasFetched2, updatedRegimenDetail]);

  const getDrugNameById = (id: string) => {
    const drug = drugs?.find((drug: DrugData) => drug.id === id);
    return drug ? drug.name : "Unknown Drug";
  };

  const [formulas, setFormulas] = useState<formula[] | undefined>();

  const onFinish = (values: any) => {
    console.log(values);

    const setformula = selectedRegimenDetail?.regimenFormulas.map(
      (formulas, index) => ({
        id: formulas.formula.id,
        drugId: formulas.formula.drugId,
        formulaQuantity: formulas.formula.formulaQuantity,
        formulaUnit: formulas.formula.formulaUnit,
        diluteDescription: formulas.formula.diluteDescription,
        quantity: values[`doctorAmount_${index}`],
        usage: formulas.usage,
      })
    );

    setFormulas(setformula);
    const totalCyclesToUse =
      CycleData?.totalCycles !== null
        ? CycleData.totalCycles
        : values.totalcycle;

    //เอาไปเก็บในนั้น
    setUpdatedRegimenDetail({
      formulas: setformula,
      totalCycles: totalCyclesToUse,
      preMedication: values.premedNote,
      regimenRemark: values.remarkNote,
      regimenMedication: values.medicationNote, //เอาเป็น noteไว้ชั่วคราวก่อน
      regimenHomeMedication: values.homemedNote,
      isInsurance: values.isInsurance || false,
    });
    console.log(updatedRegimenDetail);
    setTab("3");
  };

  const onBack = async () => {
    setUpdatedRegimenDetail(undefined);
    setHasFetched(false);
    setHasFetched2(false);
    setTab("1");
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  // const { pathname } = useLocation();
  // console.log(pathname);
  // console.log(medicationtext);

  //for mapping unique item in each days
  const uniqueDay = new Map<
    string,
    { medicine: string; formulaquantity: string; dilutedescription: string }[]
  >();

  console.log(premedtext);

  function calculateDefaultQuantity(
    unit: string,
    formulaQuantity: number,
    BW: any,
    sCr: any,
    Ht: any,
    age: any
  ) {
    switch (unit) {
      case "mg/kg":
        return (formulaQuantity * BW).toFixed(2);
      case "mg/m2":
        return (formulaQuantity * Math.sqrt((BW * Ht) / 3600)).toFixed(2);
      case "AUC5":
        return ((25 + ((140 - age) * BW) / (sCr * 72)) * 5).toFixed(2);
      default:
        return 240;
    }
  }

  // const drugNameMapping = {};
  //   Drugdata?.forEach((drugId) => {
  //   drugNameMapping[drugId] = Drugdata.name;
  //   });
  //   setDrugData(drugNameMapping);
  //   };
  //   fetchData();
  return (
    <div className="box">
      <Form
        form={form}
        name="updateregidetail"
        //initialValues={{ premedtext: premedtext }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="patient-information">
          <div className="head">
            <h1>{selectedRegimenDetail?.name}</h1>
            {/* <tr className="cycledetail">
              <Form.Item<FieldType>
                name={"totalcycle"}
                label="Total Cycle"
                rules={[{ required: true, message: "Total cycle is required" }]}
              >
                <Input className="short-text" />
              </Form.Item>
            </tr> */}
            <div className="cycledetail">
              {isTotalCyclesEditable ? (
                <Form.Item<FieldType>
                  name={"totalcycle"}
                  label={
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#00104f",
                        marginRight: "8px",
                        width: "100px",
                      }}
                    >
                      Total Cycle
                    </span>
                  }
                  rules={[
                    { required: true, message: "Total cycle is required" },
                  ]}
                >
                  <Input
                    className="short-text"
                    defaultValue={
                      updatedRegimenDetail
                        ? updatedRegimenDetail.totalCycles
                        : undefined
                    }
                  />
                </Form.Item>
              ) : (
                <div>
                  <label style={{ fontSize: "16px", color: "#00104f" }}>
                    Total Cycle:{" "}
                  </label>
                  <span style={{ fontSize: "16px", color: "#00104f" }}>
                    {CycleData.totalCycles}
                  </span>
                </div>
              )}

              <div>
                <label style={{ fontSize: "16px", color: "#00104f" }}>
                  This is cycle No. :{" "}
                </label>
                <span style={{ fontSize: "16px", color: "#00104f" }}>
                  {CycleData.cycleNumber}
                </span>
              </div>
            </div>
          </div>
          <div className="line1">
            <div className="short-container">
              <p>Age</p>
              <li>{CycleData?.patient.age}</li> {/* ค่าที่แสดง */}
            </div>
            <div className="short-container">
              <p>Bw(kg) </p>
              <li>{CycleData?.patient.BW}</li> {/* ค่าที่แสดง */}
            </div>
            <div className="short-container">
              <p>Ht(cm) </p>
              <li>{CycleData?.patient.Ht}</li> {/* ค่าที่แสดง */}
            </div>
            <div className="short-container">
              <p>sCr(mg/dL) </p>
              <li>{CycleData?.patient.sCr}</li> {/* ค่าที่แสดง */}
            </div>
          </div>
        </div>

        <div className="line2">
          <div className="short-container">
            <p>BSA </p>
            <p>
              {CycleData?.patient.Ht && CycleData?.patient.BW
                ? Math.sqrt(
                    (CycleData?.patient.Ht * CycleData?.patient.BW) / 3600
                  ).toFixed(2)
                : "N/A"}
            </p>
          </div>
          <div className="short-container">
            <p>Clcr (M) </p>
            <p>
              {CycleData?.patient.age &&
              CycleData?.patient.BW &&
              CycleData?.patient.sCr
                ? (
                    ((140 - CycleData?.patient.age) * CycleData?.patient.BW) /
                    (CycleData?.patient.sCr * 72)
                  ).toFixed(2)
                : "N/A"}
            </p>
          </div>
          <div className="short-container">
            <p>Clcr (F) </p>
            <p>
              {CycleData?.patient.age &&
              CycleData?.patient.BW &&
              CycleData?.patient.sCr
                ? (
                    (((140 - CycleData?.patient.age) * CycleData?.patient.BW) /
                      (CycleData?.patient.sCr * 72)) *
                    0.85
                  ).toFixed(2)
                : "N/A"}
            </p>
          </div>
        </div>
        <label>
          <Col span={2}>
            <Form.Item<FieldType>
              name={"isInsurance"}
              valuePropName="checked"
              wrapperCol={{ span: 16 }}
            >
              <Checkbox name={"insurancestatus"} style={{ fontSize: "16px" }}>
                Insurance
              </Checkbox>
            </Form.Item>
          </Col>
        </label>
        <div className="premed">
          <h2>Pre-Medication</h2>
          <Form.Item<FieldType> name={"premedNote"}>
            <TextArea
              rows={4}
              placeholder="Note Area"
              style={{
                width: "calc(100vw - 300px)",
                fontSize: "16px",
                margin: "0 auto",
              }}
              className="textareas"
              defaultValue={premedtext}
            />
          </Form.Item>
        </div>

        <table className="formulatable">
          <thead>
            <tr className="medicinerow">
              <th className="medicineheader1">Day</th>
              <th className="medicineheader2">Drug</th>
              <th className="medicineheader3">Quantity</th>
            </tr>
          </thead>
          {/* <tbody>
            {selectedRegimenDetail?.regimenFormulas.map(
              ({ usage, formula }, index) => (
                <tr className="medicinerow" key={index}>
                  <td className="medicinebody">{usage}</td>
                  <td className="medicinebody">
                    {getDrugNameById(formula.drugId)} ({formula.formulaQuantity} {formula.formulaUnit})
                    {formula.diluteDescription && <><br />+ {formula.diluteDescription}</>} 
                  </td>
                  <td className="medicinebody">
                    <Form.Item<FieldType>
                      name={`doctorAmount_${index}` as "doctorAmount"}
                      initialValue={calculateDefaultQuantity(
                        formula.formulaUnit,
                        formula.formulaQuantity,
                        CycleData?.patient.BW,
                        CycleData?.patient.sCr,
                        CycleData?.patient.Ht,
                        CycleData?.patient.age
                      )}
                    >
                      <Input
                        style={{
                          width: 120, // or you can remove this if you want it to be 100% width
                          margin: "auto",
                        }}
                        suffix="mg"
                      ></Input>
                    </Form.Item>
                  </td>
                </tr>
              )
            )}
          </tbody> */}

          <tbody>
            {selectedRegimenDetail?.regimenFormulas.map(
              ({ usage, formula }, index) => {
                // Attempt to find the matching formula in updatedRegimenDetail
                const matchingFormula = updatedRegimenDetail?.formulas?.find(
                  (f) => f.id === formula.id
                );

                // Determine the initial value: if a matching formula is found, use its quantity; otherwise, calculate the default quantity
                const initialValue = matchingFormula
                  ? matchingFormula.quantity
                  : calculateDefaultQuantity(
                      formula.formulaUnit,
                      formula.formulaQuantity,
                      CycleData?.patient.BW,
                      CycleData?.patient.sCr,
                      CycleData?.patient.Ht,
                      CycleData?.patient.age
                    );

                return (
                  <tr className="medicinerow" key={index}>
                    <td className="medicinebody">{usage}</td>
                    <td className="medicinebody">
                      {getDrugNameById(formula.drugId)} (
                      {formula.formulaQuantity} {formula.formulaUnit})
                      {formula.diluteDescription && (
                        <>
                          <br />+ {formula.diluteDescription}
                        </>
                      )}
                    </td>
                    <td className="medicinebody">
                      <Form.Item<FieldType>
                        name={`doctorAmount_${index}` as "doctorAmount"}
                        initialValue={initialValue}
                      >
                        <Input
                          style={{
                            width: 120, // or you can remove this if you want it to be 100% width
                            margin: "auto",
                          }}
                          suffix="mg"
                        ></Input>
                      </Form.Item>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>

        <div className="drugcontainer">
          <table className="usagesummary9">
            <tbody>
              {Array.from(uniqueDay.entries()).map(([day, entries], index) => (
                <span key={index}>
                  {/* Medicine row */}
                  <tr>
                    <td colSpan={3} className="day">
                      {day}
                    </td>
                  </tr>
                  {/* Data rows */}
                  <tr>
                    <td className="medicine9">{entries[0].medicine}</td>
                    <td className="formulaquantity">
                      {entries[0].formulaquantity}
                    </td>
                  </tr>
                  {entries
                    .slice(1)
                    .map(({ medicine, formulaquantity }, subIndex) => (
                      <tr key={subIndex}>
                        <td className="medicine9">{medicine}</td>
                        <td className="formulaquantity">{formulaquantity}</td>
                      </tr>
                    ))}
                </span>
              ))}
            </tbody>
          </table>
        </div>

        <div className="note">
          <h3>Note : {selectedRegimenDetail?.note}</h3>
        </div>

        <div className="remark">
          <h2 className="remarkheader">Remark</h2>
          <Form.Item<FieldType> name={"remarkNote"} initialValue={remarktext}>
            <TextArea
              rows={4}
              placeholder="Note Area"
              className="textareas"
              style={{
                width: "calc(100vw - 300px)",
                fontSize: "16px",
                margin: "0 auto",
              }}
            />
          </Form.Item>
        </div>

        <div className="medication">
          <h2>Medication</h2>
          <Form.Item<FieldType>
            name={"medicationNote"}
            initialValue={medicationtext}
          >
            <TextArea
              className="textareas"
              rows={4}
              placeholder="Note Area"
              style={{
                width: "calc(100vw - 300px)",
                fontSize: "16px",
                margin: "0 auto",
              }}
            />
          </Form.Item>
        </div>

        <div className="homemed">
          <h2>Home-Med</h2>
          <Form.Item<FieldType> name={"homemedNote"} initialValue={homemedtext}>
            <TextArea
              className="textareas"
              rows={4}
              placeholder="Note Area"
              style={{
                width: "calc(100vw - 300px)",
                fontSize: "16px",
                margin: "0 auto",
              }}
            />
          </Form.Item>
        </div>

        <div className="two-button">
          <Button onClick={() => onBack()} className="recheckmedicinebutton">
            Back
          </Button>

          <Button htmlType="submit" className="recheckmedicinebutton">
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DoctorCycleDetail;
