import { DisabledLocationMenuSlice } from "@/types/disabledLocationMenu";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DisabledLocationMenuSlice = {
  items: [],
  isLoading: false,
  error: null,
};

const disabledLocationMenuSlice = createSlice({
  name: "disabledLocationMenu",
  initialState,
  reducers: {
    setDisabledLocationMenus: (state, action) => {
      state.items = action.payload;
    },
    // addDisabledLocationMenu: (state, action) => {
    //   const exist = state.items.find((item) => item.id === action.payload.id);
    //   if (!exist) {
    //     state.items = [...state.items, action.payload];
    //   }
    // },
    removeDisabledLocationMenu: (state, action) => {
      const { locationId, menuId } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.locationId === locationId && item.menuId === menuId)
      );
    },
  },
});

export const {
  setDisabledLocationMenus,
  // addDisabledLocationMenu,
  removeDisabledLocationMenu,
} = disabledLocationMenuSlice.actions;
export default disabledLocationMenuSlice.reducer;
