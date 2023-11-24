import { SnackBarSlice } from "@/types/snackBar";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SnackBarSlice = {
  open: false,
  message: null,
  autoHideDuration: 5000,
  severity: "success",
};

const snackBarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setOpenSnackBar: (state, action) => {
      const {
        message,
        autoHideDuration = 5000,
        severity = "success",
      } = action.payload;
      state.open = true;
      state.message = message;
      state.autoHideDuration = autoHideDuration;
      state.severity = severity;
    },
    resetSnackBar: (state) => {
      state.open = false;
    },
  },
});

export const { setOpenSnackBar, resetSnackBar } = snackBarSlice.actions;
export default snackBarSlice.reducer;
