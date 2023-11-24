import { MenuCategoryMenuSlice } from "@/types/menuCategoryMenu";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: MenuCategoryMenuSlice = {
  items: [],
  isLoading: false,
  error: null,
};

const menuCategoryMenuSlice = createSlice({
  name: "menuCategoryMenu",
  initialState,
  reducers: {
    setMenuCategoryMenus: (state, action) => {
      state.items = action.payload;
    },
    addMenuCategoryMenus: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    replaceMenuCategoryMenu: (state, action) => {
      const otherIds = state.items.filter(
        (item) => item.menuId !== action.payload[0].menuId
      );
      state.items = [...otherIds, ...action.payload];
    },
    removeMenuCategoryMenu: (
      state,
      action: PayloadAction<{ menuCategoryId: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.menuCategoryId !== action.payload.menuCategoryId
      );
    },
  },
});

export const {
  setMenuCategoryMenus,
  replaceMenuCategoryMenu,
  addMenuCategoryMenus,
  removeMenuCategoryMenu,
} = menuCategoryMenuSlice.actions;
export default menuCategoryMenuSlice.reducer;
