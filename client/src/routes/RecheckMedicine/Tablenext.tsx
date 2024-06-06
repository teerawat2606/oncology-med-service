import React, { useEffect, useState } from "react";
import "./Tablenext.css";
import { Link } from "react-router-dom";
import { Inventory, RecheckMedicine } from ".";
import { cycleApi, recheckmedicine } from "../../api";
import { Button, Form, InputNumber } from "antd";
import { PatientData } from "./Table";
import { Drug } from "../../interfaces/Bottles";
import { useNavigate } from "react-router";
interface Props {
  patientData: PatientData;
  inventoryData: Array<Inventory>;
  recheckmedicine: Array<RecheckMedicine> | undefined;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  cycleId: string | undefined;
}
const Tablenext: React.FC<Props> = ({
  patientData,
  inventoryData,
  recheckmedicine,
  setTab,
  cycleId,
}) => {
  console.log(recheckmedicine);
  console.log(inventoryData);
  // Create a map to store unique medicines and their corresponding sizes and requests
  const uniqueMedicines = new Map<
    string,
    { size: string; available: string }[]
  >();

  // Process the usagesummaryData to group by medicine
  inventoryData.forEach(({ medicine, size, available }) => {
    if (!uniqueMedicines.has(medicine)) {
      uniqueMedicines.set(medicine, []);
    }
    uniqueMedicines.get(medicine)?.push({ size, available });
  });
  // const param = recheckmedicine
  //   ?.map((drug, index) => recheckmedicine[index]?.drugId)
  //   .join(",");
  const param = recheckmedicine?.map((drug) => drug.drugId).join(",");
  // recheckmedicine = [{drugId: 1}, {drugId: 3}]
  // recheckmedicine?.map((drug) => drug.drugId) => [1, 3]
  // recheckmedicine?.map((drug) => drug.drugId).join(",") => 1,3
  const [drugs, setDrugs] = useState<Drug[] | undefined>();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(param);
    if (param) {
      const fetchData = async () => {
        console.log(param);
        const allDrugs = await cycleApi.getBottlesInventory(param);
        setDrugs(allDrugs);
        console.log(allDrugs);
      };
      fetchData();
    }
  }, [param]);

  const onFinish = async (values: any) => {
    try {
      const res = await cycleApi.patchRecheckMedicine(
        cycleId,
        recheckmedicine?.map(({ formulaId, pharmacyAmount, location }) => ({
          id: formulaId,
          quantity: pharmacyAmount,
          location: location,
        })),

        drugs?.reduce((acc, { bottles }) => {
          bottles.forEach((bottle) => {
            acc.push({
              id: Number(bottle.id),
              quantity: values[`quantity_${bottle.id}`],
            });
          });

          return acc;
        }, [] as { id: number; quantity: number }[]),
        patientData?.pharmacyNote
      );
      const result = await res.json();
      navigate("/homepage", { replace: true });
      console.log("Success:", result);
      console.log(values);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // type FieldType = {
  //   quantity: number;
  // };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const calculateTotalPharmacyAmount = (drugId: number) => {
    const filteredMedicineEntries = recheckmedicine?.filter(
      (entry) => entry.drugId === drugId
    );
    const totalPharmacyAmount = filteredMedicineEntries?.reduce(
      (sum, entry) => sum + (entry.pharmacyAmount || 0),
      0
    );
    return totalPharmacyAmount;
  };

  return (
    <div className="table-container-recheck-2">
      <Form
        name="basic"
        className="flexxxx"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div className="flexxx">
          <div className="cycle1">
            <div className="returnmedicineheading">
              <div>
                <h1>Medicine Request</h1>
              </div>
            </div>
          </div>
          <table className="recheckmedicine">
            <thead className="heading">
              <tr>
                <td className="returnmedicineheadermedicine">
                  List of Medicine
                </td>
                <td className="returnmedicineheaderrequest">Inventory</td>
                <td className="returnmedicineheaderreturn">Quantity</td>
              </tr>
            </thead>
            <tbody>
              {drugs &&
                drugs.map(({ id, bottles }, index) => (
                  <React.Fragment key={index}>
                    {/* Medicine row */}
                    <tr>
                      <td colSpan={3} className="medicine">
                        {
                          recheckmedicine?.find(
                            ({ drugId }) => drugId === Number(id)
                          )?.drugName
                        }{" "}
                        {calculateTotalPharmacyAmount(Number(id))}
                        mg
                      </td>
                    </tr>

                    {bottles.map(({ id, name, inventory }, index: number) => (
                      <tr key={index}>
                        <td className="size">{name}</td>
                        <td className="inventory">{inventory}</td>
                        <td className="quantity">
                          <Form.Item
                            name={`quantity_${id}`}
                            rules={[
                              {
                                required: true,
                                message: "Please select a quantity!",
                              },
                            ]}
                          >
                            <InputNumber />
                          </Form.Item>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
          <div className="notefrompharmacy">
            <p>Note from Pharmacy</p>
            <p>{patientData.pharmacyNote}</p>
          </div>
        </div>
        <div className="allrecheckmedicinebutton">
          <div className="recheckmedicinebutton1">
            <Button
              htmlType="submit"
              className="recheckmedicinebutton"
              onClick={() => setTab("1")}
            >
              Back
            </Button>
          </div>
          <div className="recheckmedicinebutton1">
            <Button htmlType="submit" className="recheckmedicinebutton">
              Complete
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Tablenext;
