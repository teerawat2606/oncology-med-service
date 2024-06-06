import { useState } from "react";
import "./box.css";
import { Outlet, Link, useLocation } from "react-router-dom";

import generatePDF, { Options } from "react-to-pdf";
import "./box.css";
import { Card } from "./card";
import { Container } from "./container";
import { Button } from "antd";
import { MedRequestInputType } from "../med-quantity/box";

const options: Options = {
  filename: "using-function.pdf",
  // page: {
  //   margin: 20,
  // },
};

const getTargetElement = () => document.getElementById("container");
const downloadPdf = () => generatePDF(getTargetElement, options);

type NameProps = {
  name: string;
  wbc: number | null;
  btc: number | null;
  pmc: number | null;
  thc: number | null;
  dtc: number | null;
  emc: number | null;
  meddata: MedRequestInputType;
};

const linkArr = [
  {
    name: "Back",
    path: "/costverification",
  },
  {
    name: "Export",
    path: "/printpreview",
  },
];

const Box: React.FC<NameProps> = ({
  name,
  wbc,
  btc,
  pmc,
  thc,
  dtc,
  emc,
  meddata,
}) => {
  const { pathname } = useLocation();
  console.log(pathname);
  const [tab, setTab] = useState("to-do");

  return (
    <div className="table-container-print">
      <div>
        <h2 className="text-print">Print Preview - ใบประเมินค่าใช้จ่าย </h2>
        <Container>
          <div id="container">
            <Card
              name={name}
              wbc={wbc}
              btc={btc}
              pmc={pmc}
              thc={thc}
              dtc={dtc}
              emc={emc}
              meddata={meddata}
            />
          </div>
          <button onClick={downloadPdf} className="download-button">
            Download PDF
          </button>
        </Container>
      </div>
    </div>
  );
};

export default Box;
