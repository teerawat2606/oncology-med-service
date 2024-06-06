import auth from "./authApi";
import cycleApi from "./cycleApi";
import patient from "./patientApi";
import inventory from "./inventory";
import regimenlist from "./regimenlist";
import regimendrugdefault from "./regimendrug-default";
import medicine from "./medicine";
import medrequest from "./med-request";
import patientinfo from "./patientinfo";
import recheckmedicine from "./recheck";
import allpatientinfo from "./all-patient-info";
import patientdetail from "./patient-detail";
import userApi from "./user";
import drugApi from "./drugApi";
import regimenApi from "./regimenApi";
import calendarApi from "./calendarApi";
import generalApi from "./general";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export {
  auth,
  cycleApi,
  patient,
  regimenApi,
  inventory,
  patientinfo,
  recheckmedicine,
  allpatientinfo,
  medicine,
  medrequest,
  regimenlist,
  regimendrugdefault,
  patientdetail,
  userApi,
  drugApi,
  calendarApi,
  generalApi,
};
