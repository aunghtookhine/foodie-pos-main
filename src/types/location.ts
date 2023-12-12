import { Location } from "@prisma/client";

export interface LocationSlice {
  items: Location[];
  selectedLocation: Location | null;
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface CreateNewLocationOptions extends BaseOptions {
  name: string;
  street: string;
  township: string;
  city: string;
  companyId: number;
}

export interface UpdateLocationOptions extends BaseOptions {
  id: number;
  name: string;
  street: string;
  township: string;
  city: string;
  companyId: number;
}

export interface DeleteLocationOptions extends BaseOptions {
  id: number;
}
