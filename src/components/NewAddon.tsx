import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewAddon } from "@/store/slices/addonSlice";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import { CreateAddonOptions } from "@/types/addon";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { AddonCategory } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultNewAddon = {
  name: "",
  price: 0,
  addonCategoryId: undefined,
};

const NewAddon = ({ open, setOpen }: Props) => {
  const [newAddon, setNewAddon] = useState<CreateAddonOptions>(defaultNewAddon);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  const dispatch = useAppDispatch();
  const onSuccess = () => {
    setOpen(false);
    dispatch(setOpenSnackBar({ message: "successfully created." }));
    setNewAddon(defaultNewAddon);
  };
  const handleCreateNewAddon = () => {
    dispatch(
      createNewAddon({
        ...newAddon,
        onSuccess,
      })
    );
  };
  return (
    <Dialog
      onClose={() => {
        setOpen(false);
        setNewAddon(defaultNewAddon);
      }}
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
      <DialogTitle>Create New Addon</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          label={"Name"}
          sx={{ mt: 2 }}
          onChange={(evt) =>
            setNewAddon({ ...newAddon, name: evt.target.value })
          }
        />
        <TextField
          label={"Price"}
          sx={{ mt: 2 }}
          onChange={(evt) =>
            setNewAddon({ ...newAddon, price: Number(evt.target.value) })
          }
        />
        <FormControl sx={{ mt: 2 }} fullWidth>
          <InputLabel>Addon Category</InputLabel>
          <Select
            value={newAddon.addonCategoryId}
            onChange={(evt) =>
              setNewAddon({
                ...newAddon,
                addonCategoryId: Number(evt.target.value),
              })
            }
            input={<OutlinedInput label="Addon Category" />}
            renderValue={(selectedAddonCategoryId) => {
              return (
                addonCategories.find(
                  (addonCategory) =>
                    addonCategory.id === selectedAddonCategoryId
                ) as AddonCategory
              ).name;
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {addonCategories.map((addonCategory) => (
              <MenuItem key={addonCategory.id} value={addonCategory.id}>
                <ListItemText primary={addonCategory.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => {
              setOpen(false);
              setNewAddon(defaultNewAddon);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!newAddon.name || !newAddon.addonCategoryId}
            onClick={handleCreateNewAddon}
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewAddon;
