import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteAddonCategory,
  updateAddonCategory,
} from "@/store/slices/addonCategorySlice";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import { UpdateAddonCategoryOptions } from "@/types/addonCategory";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Menu } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const UpdateAddonCategoryPage = () => {
  const router = useRouter();
  const addonCategoryId = Number(router.query.id);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [data, setData] = useState<UpdateAddonCategoryOptions>();

  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  const menuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );
  const menus = useAppSelector((state) => state.menu.items);
  const addonCategory = addonCategories.find(
    (item) => item.id === addonCategoryId
  );

  const menuIds = menuAddonCategories
    .filter(
      (menuAddonCategory) =>
        menuAddonCategory.addonCategoryId === addonCategoryId
    )
    .map((item) => item.menuId);

  useEffect(() => {
    if (addonCategory) {
      setData({
        id: addonCategoryId,
        name: addonCategory.name,
        isRequired: addonCategory.isRequired,
        menuIds,
      });
    }
  }, [addonCategory]);

  if (!addonCategory || !data) return null;

  const handleUpdateAddonCategory = () => {
    dispatch(
      updateAddonCategory({
        ...data,
        onSuccess: () => {
          router.push("/backoffice/addon-categories");
          dispatch(setOpenSnackBar({ message: "Successfully updated." }));
        },
      })
    );
  };

  const handleDeleteAddonCategory = () => {
    dispatch(
      deleteAddonCategory({
        id: addonCategoryId,
        onSuccess: () => {
          router.push("/backoffice/addon-categories");
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
        <Typography variant="h4">Update Addon Category</Typography>
      </Box>
      <TextField
        defaultValue={addonCategory.name}
        onChange={(evt) =>
          setData({
            ...data,
            name: evt.target.value,
          })
        }
      />
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Menu</InputLabel>
        <Select
          multiple
          value={data.menuIds}
          onChange={(evt) =>
            setData({
              ...data,
              menuIds: evt.target.value as number[],
            })
          }
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
              <Checkbox checked={data.menuIds?.includes(menu.id)} />
              <ListItemText primary={menu.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={<Checkbox defaultChecked={addonCategory.isRequired} />}
        onChange={(evt, value) => setData({ ...data, isRequired: value })}
        label="Required"
      />
      <Box sx={{ mt: 2 }}>
        <Button variant={"contained"} onClick={handleUpdateAddonCategory}>
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
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You cannot retrieve this addon category after you deleted. If you
            want this in the future, you will have to create it again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Disagree</Button>
          <Button onClick={handleDeleteAddonCategory} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateAddonCategoryPage;
