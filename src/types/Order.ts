import type { Product } from "./Product";

export type Order = {
  id: number;
  userId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
  status: "w przygotowaniu" | "wysłane" | "odebrane" | "zwrot";
  createdAt: string; // ISO string daty
};
