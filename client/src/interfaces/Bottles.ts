export interface Drug {
  id: number;
  bottles: {
    id: number;
    name: string;
    inventory: number;
    cost: number;
    quantity?: number;
  }[];
}
