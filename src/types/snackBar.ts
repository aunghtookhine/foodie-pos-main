type SnackBarSeverity = "success" | "error";

export interface SnackBarSlice {
  open: boolean;
  message: string | null;
  autoHideDuration: number;
  severity: SnackBarSeverity;
}
