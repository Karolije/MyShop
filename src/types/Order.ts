
export type OrderStatus = 'w przygotowaniu' | 'wysłane' | 'odebrane' | 'zwrot';
export type OrderItem = {
  productId: number;
  quantity: number;
};

export type Order = {
  id: number;
  userId: string;
  products: OrderItem[];  // to się nazywa 'products', nie 'items'
  status: "w przygotowaniu" | "wysłane" | "odebrane" | "zwrot";
  createdAt: string;
};
