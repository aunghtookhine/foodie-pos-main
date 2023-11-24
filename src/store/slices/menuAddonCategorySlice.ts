import { MenuAddonCategorySlice } from "@/types/menuAddonCategory";
import { createSlice } from "@reduxjs/toolkit";

const initialState: MenuAddonCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

const menuAddonCategorySlice = createSlice({
  name: "menuAddonCategory",
  initialState,
  reducers: {
    setMenuAddonCategories: (state, action) => {
      state.items = action.payload;
    },
    addMenuAddonCategory: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    replaceMenuAddonCategory: (state, action) => {
      const otherMenuAddonCategories = state.items.filter(
        (item) => item.addonCategoryId !== action.payload[0].addonCategoryId
      );
      state.items = [...otherMenuAddonCategories, ...action.payload];
    },
    removeMenuAddonCategoryById: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    removeMenuAddonCategoryByMenuId: (state, action) => {
      state.items = state.items.filter(
        (item) => item.menuId !== action.payload.menuId
      );
    },
  },
});

export const {
  setMenuAddonCategories,
  addMenuAddonCategory,
  replaceMenuAddonCategory,
  removeMenuAddonCategoryById,
  removeMenuAddonCategoryByMenuId,
} = menuAddonCategorySlice.actions;
export default menuAddonCategorySlice.reducer;
