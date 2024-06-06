import { SetStateAction, useEffect, useState } from "react";
import "./Table.css";
import { FormProps, Link } from "react-router-dom";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { RecheckMedicine } from ".";
import TextArea from "antd/es/input/TextArea";
interface Props {
  patientData: PatientData;
  patientinfoData: PatientInfoData | undefined;
  recheckmedicineData: Array<RecheckMedicine> | undefined;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  setRecheckMedicineData: React.Dispatch<
    React.SetStateAction<RecheckMedicine[] | undefined>
  >;
  setPatientData: React.Dispatch<SetStateAction<PatientData | undefined>>;
}
type FieldType = {
  pharmacyNote: string;
  pharmacyAmount: number;
  medicine: string;
  location: string;
};
export interface PatientData {
  HN: number;
  patientName: string;
  regimenName: string;
  pharmacyNote?: string;
}

interface PatientInfoData {
  name: string;
  age: number;
  BW: number;
  Ht: number;
  sCr: number;
  BSA: number;
  ClCrM: number;
  ClCrF: number;
  regimenRemark: string;
}

const Table: React.FC<Props> = ({
  patientData,
  patientinfoData,
  recheckmedicineData,
  setTab,
  setRecheckMedicineData,
  setPatientData,
}) => {
  // const filteredPatients = patientData.filter(
  //   (patient) => patient.cyclenumber === "00000001"
  // );
  // const filteredInfo = patientinfoData.filter(
  //   (patientinfo) => patientinfo.patientname === "Shane"
  // );
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };
  const onFinish = (values: any) => {
    console.log(values);

    const newRecheckMedicine = recheckmedicineData?.map(
      (recheckmedicine, index) => ({
        ...recheckmedicine,
        pharmacyAmount: values[`pharmacyAmount_${index}`],
        location: values[`location_${index}`],
      })
    );

    setRecheckMedicineData(newRecheckMedicine);
    setPatientData({
      ...patientData,
      pharmacyNote: values["pharmacyNote"],
    });
    setTab("2");
  };
  useEffect(() => {
    console.log(recheckmedicineData);
  }, [recheckmedicineData]);
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="table-container-recheck-1">
      <Form
        className="flexxxx"
        name="recheckmedicine"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          pharmacyNote: patientData.pharmacyNote,
          ...(recheckmedicineData &&
            Object.fromEntries(
              recheckmedicineData.map((item, index) => [
                `pharmacyAmount_${index}`,
                item.pharmacyAmount,
              ])
            )),
          ...(recheckmedicineData &&
            Object.fromEntries(
              recheckmedicineData.map((item, index) => [
                `location_${index}`,
                item.location,
              ])
            )),
        }}
      >
        {/* Your form content */}
        <div className="flexxx">
          <div className="top-table">
            <div className="recheckmedicineheading">
              <div className="patient-tag">
                <div className="patientnameandHN">
                  {patientData.patientName}
                  <p className="HN">
                    {"("} {patientData.HN} {")"}
                  </p>
                </div>
                <div className="regimen">
                  Regimen : {patientData.regimenName}
                </div>
              </div>
            </div>

            <div className="middle-top-table">
              <div className="information">
                <div className="subinfo">
                  <p>Age : {patientinfoData?.age}</p>
                  <p>
                    BW {"("}kg{")"} : {patientinfoData?.BW}
                  </p>
                  <p>
                    Ht {"("}cm{")"} : {patientinfoData?.Ht}
                  </p>
                  <p>
                    sCr {"("}mg/dL{")"} : {patientinfoData?.sCr}
                  </p>
                </div>
                <div className="subinfo">
                  <p>BSA : {patientinfoData?.BSA}</p>
                  <p>
                    Clcr {"("}M{")"}: {patientinfoData?.ClCrM}
                  </p>
                  <p>
                    Clcr {"("}F{")"}: {patientinfoData?.ClCrF}
                  </p>
                </div>
              </div>
            </div>
            <div className="notefromdoctor">
              <p>Note from Doctor</p>
              <p>{patientinfoData?.regimenRemark}</p>
            </div>
          </div>

          <div className="middle-table">
            <table className="recheckmedicinetable">
              <thead>
                <tr className="recheckmedicinerow">
                  <th className="recheckmedicineheader"></th>
                  <th className="recheckmedicineheader">Doctor</th>
                  <th className="recheckmedicineheader">Formula</th>
                  <th className="recheckmedicineheader">Diff</th>
                  <th className="recheckmedicineheader">Pharmacy</th>
                  <th className="recheckmedicineheader">Location</th>
                </tr>
              </thead>
              <tbody>
                {recheckmedicineData?.map(
                  (
                    {
                      drugName,
                      formulaQuantity,
                      formulaUnit,
                      doctorAmount,
                      formulaAmount,
                      difference,
                    },
                    index
                  ) => (
                    <tr className="recheckmedicinerow" key={index}>
                      <td className="recheckmedicinebody">{`${drugName} ${formulaQuantity} ${formulaUnit}`}</td>
                      <td className="recheckmedicinebody">{doctorAmount}</td>
                      <td className="recheckmedicinebody">
                        {formulaAmount.toFixed(2)}
                      </td>
                      <td className="recheckmedicinebody">{difference}</td>
                      <td className="recheckmedicinebody">
                        <Form.Item<FieldType>
                          name={`pharmacyAmount_${index}` as "pharmacyAmount"}
                          // initialValues={
                          //   // recheckmedicineData[index].pharmacyAmount
                          // }
                          rules={[
                            {
                              required: true,
                              message: "Please select a quantity!",
                            },
                          ]}
                        >
                          <InputNumber
                            defaultValue={
                              recheckmedicineData[index].pharmacyAmount
                            }
                          />
                        </Form.Item>
                      </td>
                      <td className="recheckmedicinebody">
                        <Form.Item<FieldType>
                          name={`location_${index}` as "location"}
                          rules={[
                            {
                              required: true,
                              message: "Please select a location!",
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Search to Select"
                            defaultValue={recheckmedicineData[index].location}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label?.toLowerCase() ?? "").includes(
                                input.toLowerCase()
                              )
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
                            }
                            options={[
                              { value: "Pharmacy E3", label: "Pharmacy E3" },
                              { value: "Pharmacy E4", label: "Pharmacy E4" },
                              { value: "Pharmacy E6", label: "Pharmacy E6" },
                              { value: "Pharmacy A1", label: "Pharmacy A1" },
                              { value: "JTH", label: "JTH" },
                            ]}
                          />
                        </Form.Item>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            <div className="notefrompharmacy">
              <p>Note from Pharmacy</p>
              <Form.Item<FieldType> name={"pharmacyNote"}>
                <TextArea
                  rows={4}
                  placeholder="Note Area"
                  style={{ width: "calc(100vw - 500px)" }}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="allrecheckmedicinebutton">
          <div className="recheckmedicinebutton1">
            <Link className="recheckmedicinebutton" to="/homepage">
              Back
            </Link>
          </div>
          <div className="recheckmedicinebutton1">
            <Button htmlType="submit" className="recheckmedicinebutton">
              Next
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Table;
