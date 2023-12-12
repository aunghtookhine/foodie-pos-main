import { DisabledLocationMenuCategorySlice } from "@/types/disabledLocationMenuCategory";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DisabledLocationMenuCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

const disabledLocationMenuCategorySlice = createSlice({
  name: "disabledLocationMenuCategory",
  initialState,
  reducers: {
    setDisabledLocationMenuCategories: (state, action) => {
      state.items = action.payload;
    },
    removeDisabledLocationMenuCategory: (state, action) => {
      const { locationId, menuCategoryId } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(
            item.locationId === locationId &&
            item.menuCategoryId === menuCategoryId
          )
      );
    },
  },
});

export const {
  setDisabledLocationMenuCategories,
  removeDisabledLocationMenuCategory,
} = disabledLocationMenuCategorySlice.actions;
export default disabledLocationMenuCategorySlice.reducer;
