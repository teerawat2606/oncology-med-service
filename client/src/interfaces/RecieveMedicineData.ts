interface RecieveMedicineData {
  id: number;
  patient: {
    HN: number;
    name: string;
  };
  doctorName: string;
  regimenName: string;
  drugs: {
    id: number;
    name: string;
    quantity: number;
    quantityUnit: string;
    bottles: { name: string; id: number; quantity: number; return: number }[];
  }[];
}

export default RecieveMedicineData;
