import {
  AddonCategorySlice,
  CreateNewAddonCategoryOptions,
  UpdateAddonCategoryOptions,
} from "@/types/addonCategory";
import { DeleteMenuOptions } from "@/types/menu";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addMenuAddonCategory,
  replaceMenuAddonCategory,
} from "./menuAddonCategorySlice";

const initialState: AddonCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const createAddonCategory = createAsyncThunk(
  "addonCategory/createAddonCategory",
  async (options: CreateNewAddonCategoryOptions, thunkApi) => {
    const { name, isRequired, menuIds, onSuccess, onError } = options;
    try {
      const response = await fetch(
        `${config.backofficeApiUrl}/addon-category`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, isRequired, menuIds }),
        }
      );
      const { addonCategory, menuAddonCategories } = await response.json();

      thunkApi.dispatch(addAddonCategory(addonCategory));
      thunkApi.dispatch(addMenuAddonCategory(menuAddonCategories));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const updateAddonCategory = createAsyncThunk(
  "addonCategory/updateAddonCategory",
  async (options: UpdateAddonCategoryOptions, thunkApi) => {
    const { id, name, isRequired, menuIds, onSuccess, onError } = options;
    try {
      const response = await fetch(
        `${config.backofficeApiUrl}/addon-category`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id, name, isRequired, menuIds }),
        }
      );
      const { addonCategory, menuAddonCategories } = await response.json();

      thunkApi.dispatch(replaceAddonCategory(addonCategory));
      thunkApi.dispatch(replaceMenuAddonCategory(menuAddonCategories));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const deleteAddonCategory = createAsyncThunk(
  "addonCategory/deleteAddonCategory",
  async (options: DeleteMenuOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.backofficeApiUrl}/addon-category?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(removeAddonCategory({ id }));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

const addonCategorySlice = createSlice({
  name: "addonCategory",
  initialState,
  reducers: {
    setAddonCategories: (state, action) => {
      state.items = action.payload;
    },
    addAddonCategory: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceAddonCategory: (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeAddonCategory: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const {
  setAddonCategories,
  addAddonCategory,
  replaceAddonCategory,
  removeAddonCategory,
} = addonCategorySlice.actions;
export default addonCategorySlice.reducer;
