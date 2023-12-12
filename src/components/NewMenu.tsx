import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewMenu } from "@/store/slices/menuSlice";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import { CreateNewMenuOptions } from "@/types/menu";
import { config } from "@/utils/config";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { MenuCategory } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import FileDropZone from "./FileDropZone";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultMenu = {
  name: "",
  price: 0,
  menuCategoryIds: [],
};

const NewMenu = ({ open, setOpen }: Props) => {
  const [newMenu, setNewMenu] = useState<CreateNewMenuOptions>(defaultMenu);
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const [menuImage, setMenuImage] = useState<File>();
  const dispatch = useAppDispatch();

  const onSuccess = () => {
    setOpen(false);
    setNewMenu(defaultMenu);
    dispatch(setOpenSnackBar({ message: "Successfully Created." }));
  };

  const handleOnChange = (evt: SelectChangeEvent<number[]>) => {
    setNewMenu({ ...newMenu, menuCategoryIds: evt.target.value as number[] });
  };

  const handleCreateNewMenu = async () => {
    const newMenuPayload = { ...newMenu };
    if (menuImage) {
      const formData = new FormData();
      formData.append("files", menuImage);
      const response = await fetch(`${config.backofficeApiUrl}/assets`, {
        method: "POST",
        body: formData,
      });
      const { assetUrl } = await response.json();
      newMenuPayload.assetUrl = assetUrl;
    }
    dispatch(createNewMenu({ ...newMenuPayload, onSuccess }));
  };

  const onFileSelected = (files: File[]) => {
    setMenuImage(files[0]);
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
      <DialogTitle>Create New Menu</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          label={"Name"}
          sx={{ mt: 2 }}
          onChange={(evt) => setNewMenu({ ...newMenu, name: evt.target.value })}
        />
        <TextField
          label={"Price"}
          sx={{ mt: 2 }}
          onChange={(evt) =>
            setNewMenu({ ...newMenu, price: Number(evt.target.value) })
          }
        />
        <FormControl sx={{ mt: 2 }} fullWidth>
          <InputLabel>Menu Category</InputLabel>
          <Select
            multiple
            value={newMenu.menuCategoryIds}
            onChange={handleOnChange}
            input={<OutlinedInput label="Menu Category" />}
            renderValue={(selectedMenuCategoryIds) => {
              return selectedMenuCategoryIds
                .map((selectedMenuCategoryId) => {
                  const menuCategory = menuCategories.find(
                    (menuCategory) => menuCategory.id === selectedMenuCategoryId
                  ) as MenuCategory;
                  return menuCategory;
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
            {menuCategories.map((menuCategory) => (
              <MenuItem key={menuCategory.id} value={menuCategory.id}>
                <Checkbox
                  checked={newMenu.menuCategoryIds.includes(menuCategory.id)}
                />
                <ListItemText primary={menuCategory.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <FileDropZone onFileSelected={onFileSelected} />
          {menuImage && (
            <Chip
              sx={{ mt: 1 }}
              label={menuImage.name}
              onDelete={() => setMenuImage(undefined)}
            />
          )}
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
            disabled={!newMenu.name || !newMenu.menuCategoryIds.length}
            onClick={handleCreateNewMenu}
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewMenu;
