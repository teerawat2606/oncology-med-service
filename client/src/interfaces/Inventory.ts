interface Inventory {
  id: number;
  patient: {
    HN: number;
    name: string;
  };
  doctorName: string;
  regimenName: string;
  pharmacyNote: string;
  drugs: [
    {
      id: number;
      name: string;
      quantity: number;
      quantityUnit: string;
      bottles: [
        {
          id: number;
          name: string;
          quantity: number;
          cost: number;
          inventory: number;
          return: number;
          purchase: number;
          returnReceived: number;
        }
      ];
    }
  ];
}

export default Inventory;
