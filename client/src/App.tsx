import React from "react";
import "./App.css";
import Navigator from "./components/Navigator";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./routes/Login";
import Allpatient from "./routes/AllPatient";
import MedAndRegPage from "./routes/MedAndRegPage";
import OpenCycle from "./routes/opencycle";
import Inventory from "./routes/Inventory";

import Authentication from "./routes/Authentication";
import { AuthProvider } from "./providers/AuthProvider";
import Homepage from "./routes/Homepage";
import Header from "./components/Header";
import Authorization from "./routes/Authorization";
import { Role } from "./enums";

import ReturnMedicine from "./routes/ReturnMedicine";

import CycleOverview from "./routes/doctor/cycle-overview";
import UsageSummary from "./routes/UsageSummary";
import AddFormula from "./routes/MedAndRegPage/add-med";
import AddReg from "./routes/MedAndRegPage/add-reg";
import AddMed from "./routes/MedAndRegPage/add-med";
import OrderMedicine from "./routes/OrderMedicine";
import AppointmentCalendar from "./routes/Calendar";
import EditMedicine from "./routes/EditMedicine";
import RecheckMedicine from "./routes/RecheckMedicine";
import RecieveMedicine from "./routes/RecieveMedicine";
import AllCycle from "./routes/AllCycleByCase";
import CycleDetailss from "./routes/CycleDetails";
import Appointment from "./routes/Nurse/appointment";
import MedQuantity from "./routes/Nurse/med-quantity";
import GenReport from "./routes/gen-report";
import InventoryPDF from "./routes/InventoryPDF";

//import InventoryPDF from "./routes/inventoryPDF";

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <Authentication>
        <Navigator />
        <Header />
      </Authentication>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <Authentication>
              <Routes>
                <Route path="/" element={<Navigate replace to="/homepage" />} />
                <Route path="/homepage" element={<Homepage />} />
                <Route element={<Authorization allowedRoles={[Role.NURSE]} />}>
                  <Route path="/open-cycle" element={<OpenCycle />} />
                  <Route path="/cycle-cycle" element={<MedAndRegPage />} />
                </Route>
                <Route
                  element={<Authorization allowedRoles={[Role.PHARMACY]} />}
                ></Route>
                <Route
                  element={<Authorization allowedRoles={[Role.DOCTOR]} />}
                ></Route>
                <Route
                  element={<Authorization allowedRoles={[Role.INVENTORY]} />}
                ></Route>
                <Route path="/all-patient" element={<Allpatient />} />
                <Route
                  path="/backtohome"
                  element={<Navigate replace to="/homepage" />}
                />
                <Route
                  path="/medicine-and-regimen"
                  element={<MedAndRegPage />}
                />
                {/* do not delete <Route path="/cyclecycles" element={<MedAndRegPage />} /> */}
                <Route path="/add-reg" element={<AddReg />} />
                <Route path="/add-med" element={<AddMed />} />
                <Route path="/Inventory" element={<Inventory />} />
                <Route path="/appointment">
                  <Route path=":cycleId" element={<Appointment />} />
                </Route>
                <Route path="/medicine-summary">
                  <Route path=":cycleId" element={<InventoryPDF />} />
                </Route>
                <Route path="/generate-report" element={<GenReport />} />
                <Route path="/cycleoverview">
                  <Route path=":cycleId" element={<CycleOverview />} />
                </Route>

                <Route path="/medquantity">
                  <Route path=":cycleId" element={<MedQuantity />} />
                </Route>
                <Route path="/backtomedquan" element={<MedQuantity />} />
                <Route path="/usage-summary">
                  <Route path=":cycleId" element={<UsageSummary />} />
                </Route>
                <Route path="/recieve-medicine">
                  <Route path=":cycleId" element={<RecieveMedicine />} />
                </Route>
                <Route path="/order-medicine">
                  <Route path=":cycleId" element={<OrderMedicine />} />
                </Route>
                <Route path="/editmedicine" element={<EditMedicine />} />
                <Route path="/return-medicine">
                  <Route path=":cycleId" element={<ReturnMedicine />} />
                </Route>
                <Route path="/recheckmedicine">
                  <Route path=":cycleId" element={<RecheckMedicine />} />
                </Route>
                <Route path="/allcycle">
                  <Route path=":caseId" element={<AllCycle />} />
                </Route>
                <Route path="/cycledetails">
                  <Route path=":cycleId" element={<CycleDetailss />} />
                </Route>
                <Route path="/backtoallpatient" element={<Allpatient />} />
                <Route path="/add-formula" element={<AddFormula />} />
                <Route path="/calendar" element={<AppointmentCalendar />} />
              </Routes>
            </Authentication>
          }
        />
        {/* <Route path="/" element={<Login />} /> */}
        {/* NOT WORKING AS EXPECTED */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
