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
  options: FoodOption[];
};

// API response types (from backend, before adding `selected` and `quantity`)
export type APIFoodOption = Omit<FoodOption, "selected" | "quantity">;

export type APIFoodItem = Omit<
  FoodItem,
  "selected" | "quantity" | "options"
> & {
  options: APIFoodOption[];
};
