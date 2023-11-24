import {
  CreateNewMenuCategoryOptions,
  DeleteMenuCategoryOptions,
  MenuCategorySlice,
  UpdateMenuCategoryOptions,
} from "@/types/menuCategory";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAppData } from "./appSlice";
import {
  removeDisabledLocationMenuCategory,
  setDisabledLocationMenuCategories,
} from "./disabledLocationMenuCategorySlice";

const initialState: MenuCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

export const createMenuCategory = createAsyncThunk(
  "menuCategory/createMenuCategory",
  async (options: CreateNewMenuCategoryOptions, thunkApi) => {
    const { name, locationId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu-category`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, locationId }),
      });
      const menuCategory = await response.json();
      thunkApi.dispatch(addMenuCategory(menuCategory));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const updateMenuCategory = createAsyncThunk(
  "menuCategory/updateMenuCategory",
  async (options: UpdateMenuCategoryOptions, thunkApi) => {
    const { id, name, locationId, isAvailable, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu-category`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, locationId, isAvailable }),
      });
      const { menuCategory, disabledLocationMenuCategories } =
        await response.json();
      thunkApi.dispatch(replaceMenuCategory(menuCategory));
      if (isAvailable === false) {
        thunkApi.dispatch(
          setDisabledLocationMenuCategories(disabledLocationMenuCategories)
        );
      } else {
        thunkApi.dispatch(
          removeDisabledLocationMenuCategory({ locationId, menuCategoryId: id })
        );
      }
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const deleteMenuCategory = createAsyncThunk(
  "menuCategory/deleteMenuCategory",
  async (options: DeleteMenuCategoryOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.apiBaseUrl}/menu-category?id=${id}`, {
        method: "DELETE",
      });
      // thunkApi.dispatch(removeMenuCategory({ id }));
      // thunkApi.dispatch(removeMenuCategoryMenu({ menuCategoryId: id }));
      thunkApi.dispatch(fetchAppData({}));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

const menuCategorySlice = createSlice({
  name: "menuCategory",
  initialState,
  reducers: {
    setMenuCategories: (state, action) => {
      state.items = action.payload;
    },
    addMenuCategory: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceMenuCategory: (state, action) => {
      state.items = state.items.map((item) =>
        item.id !== action.payload.id ? item : action.payload
      );
    },
    removeMenuCategory: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const {
  setMenuCategories,
  addMenuCategory,
  replaceMenuCategory,
  removeMenuCategory,
} = menuCategorySlice.actions;
export default menuCategorySlice.reducer;
