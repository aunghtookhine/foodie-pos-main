import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteMenuCategory,
  updateMenuCategory,
} from "@/store/slices/menuCategorySlice";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import { UpdateMenuCategoryOptions } from "@/types/menuCategory";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const UpdateMenuCategoryPage = () => {
  const router = useRouter();
  const menuCategoryId = Number(router.query.id);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [data, setData] = useState<UpdateMenuCategoryOptions>();

  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const disabledLocationMenuCategories = useAppSelector(
    (state) => state.disabledLocationMenuCategory.items
  );

  const menuCategory = menuCategories.find(
    (item) => item.id === menuCategoryId
  );

  useEffect(() => {
    if (menuCategory) {
      const locationId = Number(localStorage.getItem("selectedLocationId"));

      const disabledLocationMenuCategory = disabledLocationMenuCategories.find(
        (item) =>
          item.locationId === locationId &&
          item.menuCategoryId === menuCategory.id
      );
      setData({
        id: menuCategoryId,
        name: menuCategory.name,
        locationId,
        isAvailable: disabledLocationMenuCategory ? false : true,
      });
    }
  }, [menuCategory, disabledLocationMenuCategories]);

  if (!menuCategory || !data) return null;

  const handleUpdateMenuCategory = () => {
    dispatch(
      updateMenuCategory({
        ...data,
        onSuccess: () => {
          router.push("/backoffice/menu-categories");
          dispatch(setOpenSnackBar({ message: "Successfully updated." }));
        },
      })
    );
  };

  const handleDeleteMenuCategory = () => {
    dispatch(
      deleteMenuCategory({
        id: menuCategoryId,
        onSuccess: () => {
          router.push("/backoffice/menu-categories");
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Update Menu Category</Typography>
        <Button
          variant="outlined"
          color={"error"}
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      </Box>
      <TextField
        defaultValue={menuCategory.name}
        onChange={(evt) =>
          setData({
            ...data,
            name: evt.target.value,
          })
        }
      />
      <FormControlLabel
        control={<Switch defaultChecked={data.isAvailable} />}
        onChange={(evt, value) => setData({ ...data, isAvailable: value })}
        label="Available"
      />
      <Box sx={{ mt: 2 }}>
        <Button variant={"contained"} onClick={handleUpdateMenuCategory}>
          Update
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
            You cannot retrieve this menu category after you deleted. If you
            want this in the future, you will have to create it again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Disagree</Button>
          <Button onClick={handleDeleteMenuCategory} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateMenuCategoryPage;
