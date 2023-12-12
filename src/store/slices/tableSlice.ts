import {
  CreateNewTableOptions,
  DeleteTableOptions,
  TableSlice,
  UpdateTableOptions,
} from "@/types/table";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: TableSlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const createNewTable = createAsyncThunk(
  "table/createNewTableSlice",
  async (options: CreateNewTableOptions, thunkApi) => {
    const { name, locationId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/table`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, locationId }),
      });
      const table = await response.json();
      thunkApi.dispatch(addTable(table));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const updateTable = createAsyncThunk(
  "table/updateTable",
  async (options: UpdateTableOptions, thunkApi) => {
    const { id, name, locationId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/table`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, locationId }),
      });
      const table = await response.json();
      thunkApi.dispatch(replaceTable(table));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const deleteTable = createAsyncThunk(
  "table/deleteTable",
  async (options: DeleteTableOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.backofficeApiUrl}/table?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(removeTable({ id }));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTables: (state, action) => {
      state.items = action.payload;
    },
    addTable: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceTable: (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeTable: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { setTables, addTable, replaceTable, removeTable } =
  tableSlice.actions;
export default tableSlice.reducer;
