import { config } from "@/utils/config";
import { Company } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CompanySlice, UpdateCompanyOptions } from "../../types/company";
const initialState: CompanySlice = {
  item: null,
  isLoading: false,
  error: null,
};

export const updateCompany = createAsyncThunk(
  "table/updateTable",
  async (options: UpdateCompanyOptions, thunkApi) => {
    const { id, name, street, township, city, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/company`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, street, township, city }),
      });
      const { company } = await response.json();
      thunkApi.dispatch(setCompany(company));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompany: (state, action: PayloadAction<Company>) => {
      state.item = action.payload;
    },
  },
});

export const { setCompany } = companySlice.actions;
export default companySlice.reducer;
