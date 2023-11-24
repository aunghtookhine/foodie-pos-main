import { Addon, Menu, ORDERSTATUS, Order, Table } from "@prisma/client";
import { CartItem } from "./cart";

export interface OrderSlice {
  items: Order[];
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface CreateOrderOptions extends BaseOptions {
  tableId: number;
  cartItems: CartItem[];
}

export interface UpdateOrderOptions extends BaseOptions {
  itemId: string;
  status: ORDERSTATUS;
}

export interface OrderAddon {
  addonCategoryId: number;
  addons: Addon[];
}

export interface OrderItem {
  itemId: string;
  status: ORDERSTATUS;
  orderAddons: OrderAddon[];
  menu: Menu;
  table: Table;
}
