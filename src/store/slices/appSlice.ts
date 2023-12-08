import { AppSlice, GetAppDataOptions } from "@/types/app";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setAddonCategories } from "./addonCategorySlice";
import { setAddons } from "./addonSlice";
import { setCompany } from "./companySlice";
import { setDisabledLocationMenuCategories } from "./disabledLocationMenuCategorySlice";
import { setDisabledLocationMenus } from "./disabledLocationMenuSlice";
import { setLocations } from "./locationSlice";
import { setMenuAddonCategories } from "./menuAddonCategorySlice";
import { setMenuCategoryMenus } from "./menuCategoryMenuSlice";
import { setMenuCategories } from "./menuCategorySlice";
import { setMenus } from "./menuSlice";
import { setOrders } from "./orderSlice";
import { setTables } from "./tableSlice";

const initialState: AppSlice = {
  init: false,
  isLoading: false,
  error: null,
};

export const fetchAppData = createAsyncThunk(
  "app/fetchAppData",
  async (options: GetAppDataOptions, thunkApi) => {
    const { tableId, onSuccess, onError } = options;
    const fetchAppUrl = tableId
      ? `${config.apiBaseUrl}/app?tableId=${tableId}`
      : `${config.apiBaseUrl}/app`;
    try {
      const response = await fetch(fetchAppUrl);
      const appData = await response.json();
      const {
        company,
        menuCategory,
        menu,
        menuCategoryMenu,
        addonCategory,
        menuAddonCategory,
        addons,
        location,
        table,
        disabledLocationMenuCategory,
        disabledLocationMenu,
        order,
      } = appData;

      thunkApi.dispatch(setMenuCategories(menuCategory));
      thunkApi.dispatch(setMenus(menu));
      thunkApi.dispatch(setMenuCategoryMenus(menuCategoryMenu));
      thunkApi.dispatch(setAddonCategories(addonCategory));
      thunkApi.dispatch(setMenuAddonCategories(menuAddonCategory));
      thunkApi.dispatch(setAddons(addons));
      thunkApi.dispatch(setLocations(location));
      thunkApi.dispatch(setTables(table));
      thunkApi.dispatch(
        setDisabledLocationMenuCategories(disabledLocationMenuCategory)
      );
      thunkApi.dispatch(setDisabledLocationMenus(disabledLocationMenu));
      thunkApi.dispatch(setOrders(order));
      thunkApi.dispatch(setCompany(company));
      thunkApi.dispatch(setInit(true));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInit: (state, action) => {
      state.init = action.payload;
    },
  },
});

export const { setInit } = appSlice.actions;
export default appSlice.reducer;
