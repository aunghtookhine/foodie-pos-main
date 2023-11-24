import {
  AddonSlice,
  CreateAddonOptions,
  DeleteAddonOptions,
  UpdateAddonOptions,
} from "@/types/addon";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: AddonSlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const createNewAddon = createAsyncThunk(
  "addon/createNewAddon",
  async (options: CreateAddonOptions, thunkApi) => {
    const { name, price, addonCategoryId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addon`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, addonCategoryId }),
      });
      const addon = await response.json();
      thunkApi.dispatch(addAddon(addon));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const updateAddon = createAsyncThunk(
  "addon/updateAddon",
  async (options: UpdateAddonOptions, thunkApi) => {
    const { id, name, price, addonCategoryId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addon`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, price, addonCategoryId }),
      });
      const addon = await response.json();
      thunkApi.dispatch(replaceAddon(addon));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const deleteAddon = createAsyncThunk(
  "addon/deleteAddon",
  async (options: DeleteAddonOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.apiBaseUrl}/addon?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(removeAddon({ id }));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

const addonSlice = createSlice({
  name: "addon",
  initialState,
  reducers: {
    setAddons: (state, action) => {
      state.items = action.payload;
    },
    addAddon: (state, action) => {
      console.log(action.payload);
      state.items = [...state.items, action.payload];
    },
    replaceAddon: (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeAddon: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { setAddons, addAddon, replaceAddon, removeAddon } =
  addonSlice.actions;
export default addonSlice.reducer;
