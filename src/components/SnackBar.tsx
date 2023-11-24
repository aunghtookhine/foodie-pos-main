import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetSnackBar } from "@/store/slices/snackBarSlice";
import { Alert, Snackbar } from "@mui/material";

const SnackBar = () => {
  const dispatch = useAppDispatch();
  const { open, message, autoHideDuration, severity } = useAppSelector(
    (state) => state.snackBar
  );

  setTimeout(() => dispatch(resetSnackBar()), autoHideDuration);
  return (
    <Snackbar
      open={open}
      message={message}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
