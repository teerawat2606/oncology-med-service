import { useEffect, useState } from "react";
import DoctorCycleOverview from "./cycle-overview"; //page 1
import DoctorCycleDetail from "./cycledetail"; //import page 2
import DoctorCycleSummary from "./cyclesummary"; //import pg3

// มีทั้ง getregimeninfo กับ getregimendetailinfo
import regimeninfo from "../../../api/regimenlist";
import getCycleInfo from "../../../api/cycleinfo";
//lสำหรับข้อมูลผู้ป่วย
import RecieveCycleData from "../../../interfaces/RecieveCycleData";
//สำหรับข้อมูล regimen ทั้งหมด
import RecieveRegimenData from "../../../interfaces/RecieveRegimenData";
//maybe in tab2
//import RecieveRegimenDetailData from "../../../../interfaces/RecieveRegimenDetailData"; //สำหรับ regi detail

import { useParams } from "react-router";

export interface SelectedRegimenId {
  regimenId: number;
}

export interface UpdatedRegimenDetail {
  formulas: Array<{
    formulaUnit: any;
    formulaQuantity: any;
    drugId: any;
    diluteDescription: string;
    id: string;
    quantity: number;
    usage: string;
  }> | undefined;
  totalCycles: any;
  preMedication: string;
  regimenRemark: string;
  regimenMedication: string;
  regimenHomeMedication: string;
  //isEmer: boolean;
  isInsurance: boolean;
}

export interface Emercheck {
  isEmer: boolean;
}

const CycleOverview = () => {
  const { cycleId } = useParams();
  const [CycleData, setCycleData] = useState<RecieveCycleData | undefined>(); //[] is for array
  const [allRegimenData, setAllRegimenData] = useState<RecieveRegimenData[]>(
    []
  );
  const [tab, setTab] = useState("1");
  const [emercheck,setEmercheck] = useState<Emercheck | undefined>();
  const [selectedRegimenId, setSelectedRegimenId] =
    useState<SelectedRegimenId>(); //for collecting selected regi from tab1
  const [updatedRegimenDetail, setUpdatedRegimenDetail] = useState<
    UpdatedRegimenDetail | undefined
  >(); //for collecting updated regi detail from tab2
  useEffect(() => {
    console.log(cycleId);
    if (cycleId) {
      const fetchData = async () => {
        console.log(cycleId);
        const allregimen = await regimeninfo.getRegimenInfo(); //use in pg1
        const patientinfo = await getCycleInfo(Number(cycleId)); //use in pg1

        console.log(allregimen);
        console.log(patientinfo);
        console.log(tab);
        setAllRegimenData(allregimen);
        setCycleData(patientinfo);
      };
      fetchData();
    }
  }, [cycleId]);
////////////////////////////
return (
  <div className="page-container">
    {CycleData ? (
      tab === "1" ? (
        <DoctorCycleOverview
          CycleData={CycleData}
          allRegimenData={allRegimenData}
          setCycleData= {setCycleData}
          setAllRegimenData = {setAllRegimenData}
          setTab={setTab}
          selectedRegimenId = {selectedRegimenId}
          setSelectedRegimenId = {setSelectedRegimenId}
          setUpdatedRegimenDetail={setUpdatedRegimenDetail}
          setEmercheck = {setEmercheck}

        />
      ) : tab === "2" ? (
        <DoctorCycleDetail
          CycleData={CycleData}
          selectedRegimenId = {selectedRegimenId}
          setTab={setTab}
          //cycleId={cycleId}
          updatedRegimenDetail ={updatedRegimenDetail}
          setUpdatedRegimenDetail = {setUpdatedRegimenDetail}
        />
      ) : tab === "3" ? (
      <DoctorCycleSummary
        CycleData={CycleData}
        selectedRegimenId = {selectedRegimenId}
        //setCycleData= {setCycleData}
        setSelectedRegimenId = {setSelectedRegimenId}
        setTab={setTab}
        //cycleId={cycleId}
        updatedRegimenDetail ={updatedRegimenDetail}
        emercheck = {emercheck} 
        // setUpdatedRegimenDetail = {setUpdatedRegimenDetail}
      />
      ): (<></>)
    ) : null}
    </div>
    );
};

export default CycleOverview;