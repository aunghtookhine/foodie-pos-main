import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import { deleteTable, updateTable } from "@/store/slices/tableSlice";
import { UpdateTableOptions } from "@/types/table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const UpdateTablePage = () => {
  const router = useRouter();
  const tableId = Number(router.query.id);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<UpdateTableOptions>();
  const [open, setOpen] = useState(false);

  const tables = useAppSelector((state) => state.table.items);
  const table = tables.find((table) => table.id === tableId);

  useEffect(() => {
    if (table) {
      setData({
        id: tableId,
        name: table.name,
        locationId: table.locationId,
      });
    }
  }, [table]);

  if (!table || !data) return null;

  const handleUpdateTable = () => {
    dispatch(
      updateTable({
        ...data,
        onSuccess: () => {
          router.push("/backoffice/tables");
          dispatch(setOpenSnackBar({ message: "Successfully updated." }));
        },
      })
    );
  };

  const handleDeleteTable = () => {
    dispatch(
      deleteTable({
        id: tableId,
        onSuccess: () => {
          router.push("/backoffice/tables");
          dispatch(setOpenSnackBar({ message: "Successfully deleted." }));
        },
      })
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          mb: 2,
        }}
      >
        <Typography variant="h4">Update Table</Typography>
      </Box>
      <TextField
        label={"Name"}
        defaultValue={table.name}
        onChange={(evt) => setData({ ...data, name: evt.target.value })}
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleUpdateTable}>
          Update
        </Button>
        <Button
          sx={{ ml: 2 }}
          variant="outlined"
          color={"error"}
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Confirm delete table</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this table?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Disagree</Button>
            <Button onClick={handleDeleteTable}>Agree</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default UpdateTablePage;
