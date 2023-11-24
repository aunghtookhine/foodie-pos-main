import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAddonCategory } from "@/store/slices/addonCategorySlice";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import { CreateNewAddonCategoryOptions } from "@/types/addonCategory";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Menu } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultAddonCategory = {
  name: "",
  isRequired: true,
  menuIds: [],
};

const NewAddonCategory = ({ open, setOpen }: Props) => {
  const menus = useAppSelector((state) => state.menu.items);
  const [newAddonCategory, setNewAddonCategory] =
    useState<CreateNewAddonCategoryOptions>(defaultAddonCategory);
  const dispatch = useAppDispatch();

  const onSuccess = () => {
    setOpen(false);
    setNewAddonCategory(defaultAddonCategory);
    dispatch(setOpenSnackBar({ message: "Successfully created." }));
  };

  const handleCreateNewAddonCategory = () => {
    dispatch(createAddonCategory({ ...newAddonCategory, onSuccess }));
  };
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "400px", // Set your width here
          },
        },
      }}
    >
      <DialogTitle>Create New Addon Category</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
          <TextField
            label="Name"
            onChange={(evt) =>
              setNewAddonCategory({
                ...newAddonCategory,
                name: evt.target.value,
              })
            }
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Menu</InputLabel>
            <Select
              multiple
              value={newAddonCategory.menuIds}
              onChange={(evt) => {
                setNewAddonCategory({
                  ...newAddonCategory,
                  menuIds: evt.target.value as number[],
                });
              }}
              input={<OutlinedInput label="Menu" />}
              renderValue={(selectedMenuIds) => {
                return selectedMenuIds
                  .map((selectedMenuId) => {
                    const menu = menus.find(
                      (menu) => menu.id === selectedMenuId
                    ) as Menu;
                    return menu;
                  })
                  .map((item) => item.name)
                  .join(", ");
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
              {menus.map((menu) => (
                <MenuItem key={menu.id} value={menu.id}>
                  <Checkbox
                    checked={newAddonCategory.menuIds.includes(menu.id)}
                  />
                  <ListItemText primary={menu.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            onChange={(evt, value) =>
              setNewAddonCategory({ ...newAddonCategory, isRequired: value })
            }
            label="Required"
          />
        </Box>
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
            disabled={
              !newAddonCategory.name || !newAddonCategory.menuIds.length
            }
            onClick={handleCreateNewAddonCategory}
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewAddonCategory;
