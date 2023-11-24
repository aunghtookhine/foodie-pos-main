import { Company } from "@prisma/client";

export interface CompanySlice {
  item: Company | null;
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}

export interface UpdateCompanyOptions extends BaseOptions {
  id: number;
  name: string;
  street: string;
  township: string;
  city: string;
}
