import { Role } from "../enums";

interface User {
  id: number;
  name: string;
  role: Role;
  department: string;
  hospital: string;
  lineId: string;
}

export default User;
