export type FoodOption = {
  id: string;
  name: string;
  available: boolean;
  extraPrice: number;
  selected: boolean;
  quantity: number;
};

export type FoodItem = {
  id: string;
  name: string;
  price: number;
  selected: boolean;
  quantity: number;
  options?: FoodOption[];
};
