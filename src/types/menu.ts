import { Menu } from "@prisma/client";

export interface MenuSlice {
  items: Menu[];
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface GetMenusOptions extends BaseOptions {
  locationId: string;
}

export interface CreateNewMenuOptions extends BaseOptions {
  name: string;
  price: number;
  menuCategoryIds: number[];
  assetUrl?: string;
}

export interface UpdateMenuOptions extends BaseOptions {
  id: number;
  name: string;
  price: number;
  menuCategoryIds: number[];
  locationId: number;
  isAvailable: boolean;
  assetUrl?: string;
}

export interface DeleteMenuOptions extends BaseOptions {
  id: number;
}
