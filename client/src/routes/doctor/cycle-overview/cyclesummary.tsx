import { useState, useRef, useEffect } from "react";
import "./cyclesummary.css";
import "./cycledetail.css";
import React, { SetStateAction } from "react";
import "./cycle-overview.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
// import RecieveCycleData from "../../../../interfaces/RecieveCycleData"; //lสำหรับข้อมูลผู้ป่วย
// import RecieveRegimenData from "../../../../interfaces/RecieveRegimenData"; //สำหรับข้อมูล regimen ทั้งหมด
// import regimeninfo from "../../../../api/regimenlist";
// import getCycleInfo from "../../../../api/cycleinfo";
import { Emercheck, UpdatedRegimenDetail } from ".";
import { selectedRegimenId } from "./cycle-overview";
//import InventoryPDF from "../../inventoryPDF";
import { cycleApi, drugApi } from "../../../api";
import RecieveCycleData from "../../../interfaces/RecieveCycleData";
import regimeninfo from "../../../api/regimenlist";

export interface SelectedRegimenId {
  regimenId: number;
}

export interface RecieveRegimenDetailDataonlyNote {
  note: string;
}

//เอา regimen detail มาด้วยสำหรับใส่ใน note

export interface DrugData {
  id: string;
  name: string;
}

interface Props {
  setTab: React.Dispatch<React.SetStateAction<string>>;
  updatedRegimenDetail: UpdatedRegimenDetail | undefined;
  emercheck: Emercheck | undefined;
  selectedRegimenId: SelectedRegimenId | undefined;
  setSelectedRegimenId: React.Dispatch<
    SetStateAction<selectedRegimenId | undefined>
  >;
  CycleData: RecieveCycleData | undefined;
}

const DoctorCycleSummary: React.FC<Props> = ({
  updatedRegimenDetail,
  emercheck,
  setTab,
  selectedRegimenId,
  setSelectedRegimenId,
  CycleData,
}) => {
  const { pathname } = useLocation();
  const { cycleId } = useParams();
  const [drugs, setDrugs] = useState<DrugData[] | undefined>([]);
  console.log(pathname);

  const getDrugNameById = (id: string) => {
    const drug = drugs?.find((drug: DrugData) => drug.id === id);
    return drug ? drug.name : "Unknown Drug";
  };

  const formulasText =
    updatedRegimenDetail?.formulas
      ?.map((formula) => {
        const drugName = getDrugNameById(formula.drugId);
        return `${drugName} (${formula.formulaQuantity} ${formula.formulaUnit}) + ${formula.diluteDescription} : ${formula.quantity} mg (${formula.usage})`;
      })
      .join("\n") ?? "";

  const [selectedRegimenDetail, setSelectedRegimenDetail] =
    useState<RecieveRegimenDetailDataonlyNote>();

  useEffect(() => {
    console.log(selectedRegimenId);
    if (selectedRegimenId) {
      const fetchData = async () => {
        console.log(selectedRegimenId);
        const regimenDetail = await regimeninfo.getRegimenDetailInfo(
          Number(selectedRegimenId.regimenId)
        );
        if (regimenDetail) {
          setSelectedRegimenDetail(regimenDetail[0]);
        }
        const Drugdata = await drugApi.getDrugInfo();
        setDrugs(Drugdata);
      };
      fetchData();
    }
  }, [selectedRegimenId]);

  const initialleftText = `Total Cycle : ${updatedRegimenDetail?.totalCycles}
  \nThis is Cycle No. : ${CycleData?.cycleNumber}
  \n\nPremedication :\n${updatedRegimenDetail?.preMedication}
  \nFormula : \n${formulasText}
  \n\nnote : \n${selectedRegimenDetail?.note}
  `;

  //const initialrightText = `${updatedRegimenDetail?.medication}\n${updatedRegimenDetail?.homeMed}`;
  const initialrightText = `Regimen Detail :\n
  ${updatedRegimenDetail?.regimenMedication}\n
  Home-Medication :\n
  ${updatedRegimenDetail?.regimenHomeMedication}`;

  // const [lefttext, setleftText] = useState(initialleftText);
  // const [righttext, setrightText] = useState(initialrightText);

  // const handleleftChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setleftText(event.target.value);
  // };
  // const handlerightChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setrightText(event.target.value);
  // };

  const onBack = (values: any) => {
    //ไปหน้า 2
    console.log(values);
    setTab("2");
  };

  const navigate = useNavigate();

  const onFin = async () => {
    console.log(emercheck);
    console.log(updatedRegimenDetail);
    console.log(selectedRegimenId);
    console.log(selectedRegimenId);
    if (cycleId && updatedRegimenDetail && emercheck && selectedRegimenId)
      try {
        await cycleApi.patchCycleSummary(
          +cycleId,
          { ...updatedRegimenDetail, ...emercheck, ...selectedRegimenId }
          //ต้องเก็บ selectedregi id เป็น list
        );

        navigate("/homepage", { replace: true });
        //console.log(values);
      } catch (error) {
        console.error("Error:", error);
      }
  };

  //*for copy button*

  const textareaRefleft = useRef<HTMLTextAreaElement>(null);
  const textareaRefright = useRef<HTMLTextAreaElement>(null);

  const handleleftCopy = () => {
    if (textareaRefleft.current) {
      textareaRefleft.current.select();
      document.execCommand("copy");
    }
  };

  const handlerightCopy = () => {
    if (textareaRefright.current) {
      textareaRefright.current.select();
      document.execCommand("copy");
    }
  };

  return (
    <div className="box_cyclesummary">
      <div className="patient-information">
        {/* <h2>{updatedRegimenDetail?.name}</h2> */}
        <h2>{CycleData?.patient.name}</h2>
        <p>Copy this text into OPD card</p>

        <div className="data">
          <div className="lefty">
            <textarea
              readOnly
              ref={textareaRefleft}
              value={initialleftText}
              //onChange={handleleftChange}
              style={{ resize: "none" }}
              className="textbox"
            />
            <Button onClick={handleleftCopy}>copy</Button>
          </div>

          <div className="divider"></div>

          <div className="righty">
            <textarea
              readOnly
              ref={textareaRefright}
              value={initialrightText}
              //onChange={handlerightChange}
              style={{ resize: "none" }}
              className="textbox"
            />
            <Button onClick={handlerightCopy}>copy</Button>
          </div>
        </div>
      </div>

      <div className="two-button">
        <Button
          onClick={onBack}
          htmlType="submit"
          className="recheckmedicinebutton"
        >
          Back
        </Button>

        <Button onClick={() => onFin()} className="recheckmedicinebutton">
          Done
        </Button>
      </div>
    </div>
  );
};

export default DoctorCycleSummary;
