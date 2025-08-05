export type Order = {
  id: string;
  userId: number;
  status: string;
  createdAt: string;
  items: {
    productId: string;
    quantity: number;
  }[];
};
export type OrderStatus = "nowe" | "w realizacji" | "zrealizowane" | "wysłane" | "zwrot" | "odebrane";
