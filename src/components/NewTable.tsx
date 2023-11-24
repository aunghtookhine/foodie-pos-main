import { useAppDispatch } from "@/store/hooks";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import { createNewTable } from "@/store/slices/tableSlice";
import { CreateNewTableOptions } from "@/types/table";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultTable = {
  name: "",
  locationId: undefined,
};

const NewTable = ({ open, setOpen }: Props) => {
  const [newTable, setNewTable] = useState<CreateNewTableOptions>(defaultTable);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setNewTable({
      ...newTable,
      locationId: Number(localStorage.getItem("selectedLocationId")),
    });
  }, []);

  const onSuccess = () => {
    setOpen(false);
    setNewTable(defaultTable);
    dispatch(setOpenSnackBar({ message: "Successfully Created." }));
  };

  const handleCreateNewMenu = () => {
    dispatch(createNewTable({ ...newTable, onSuccess }));
  };

  return (
    <Dialog
      onClose={() => setOpen(false)}
      open={open}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "500px", // Set your width here
          },
        },
      }}
    >
      <DialogTitle>Create New Table</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          label={"Name"}
          sx={{ mt: 2 }}
          onChange={(evt) =>
            setNewTable({ ...newTable, name: evt.target.value })
          }
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!newTable.name || !newTable.locationId}
            onClick={handleCreateNewMenu}
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewTable;
