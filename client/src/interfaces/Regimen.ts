interface Regimen {
  id: number;
  name: string;
  drugs: {
    id: number;
    name: string;
  }[];
}

export default Regimen;
