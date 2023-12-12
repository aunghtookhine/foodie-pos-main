import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createLocation } from "@/store/slices/locationSlice";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const NewLocation = ({ open, setOpen }: Props) => {
  const companyId = useAppSelector((state) => state.company.item?.id);
  const [newLocation, setNewLocation] = useState({
    name: "",
    street: "",
    township: "",
    city: "",
  });
  const dispatch = useAppDispatch();

  const onSuccess = () => {
    setOpen(false);
    dispatch(setOpenSnackBar({ message: "Successfully created." }));
  };

  if (!companyId) return null;

  const handleCreateNewLocation = () => {
    dispatch(
      createLocation({
        ...newLocation,
        companyId,
        onSuccess,
      })
    );
  };

  return (
    <Dialog
      onClose={() => setOpen(false)}
      open={open}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "400px", // Set your width here
          },
        },
      }}
    >
      <DialogTitle>Create New Location</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            label="Name"
            autoFocus
            sx={{ mt: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, name: evt.target.value })
            }
          />
          <TextField
            label="Street"
            sx={{ mt: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, street: evt.target.value })
            }
          />
          <TextField
            label="Township"
            sx={{ mt: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, township: evt.target.value })
            }
          />
          <TextField
            label="City"
            sx={{ mt: 2 }}
            onChange={(evt) =>
              setNewLocation({ ...newLocation, city: evt.target.value })
            }
          />
        </Box>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={
              newLocation.name &&
              newLocation.street &&
              newLocation.township &&
              newLocation.city
                ? false
                : true
            }
            onClick={handleCreateNewLocation}
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewLocation;
