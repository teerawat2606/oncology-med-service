const getInventoryData = async () => {
  // fetch Bankend
  return [
    {
      medicine: "00000001",
      size: "00000002",
      reserved: "3",
      available: "4",
      total: "7",
    },
    {
      medicine: "00000002",
      size: "00000002",
      reserved: "1",
      available: "8",
      total: "9",
    },
    {
      medicine: "00000002",
      size: "00000002",
      reserved: "3",
      available: "4",
      total: "7",
    },
    {
      medicine: "99999999",
      size: "00000002",
      reserved: "1",
      available: "8",
      total: "9",
    },
    {
      medicine: "12345678",
      size: "00000002",
      reserved: "3",
      available: "4",
      total: "7",
    },
    {
      medicine: "99999999",
      size: "00000002",
      reserved: "1",
      available: "8",
      total: "9",
    },
    {
      medicine: "12345678",
      size: "00000002",
      reserved: "3",
      available: "4",
      total: "7",
    },
    {
      medicine: "99999999",
      size: "00000002",
      reserved: "1",
      available: "8",
      total: "9",
    },
  ];
};

const inventory = {
  getInventoryData,
};

export default inventory;
