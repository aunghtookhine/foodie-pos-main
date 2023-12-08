import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteAddon, updateAddon } from "@/store/slices/addonSlice";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import { UpdateAddonOptions } from "@/types/addon";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AddonCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const UpdateAddonPage = () => {
  const router = useRouter();
  const addonId = Number(router.query.id);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<UpdateAddonOptions>();
  const [open, setOpen] = useState(false);

  const addons = useAppSelector((state) => state.addon.items);
  const addon = addons.find((addon) => addon.id === addonId);

  const addonCategories = useAppSelector((state) => state.addonCategory.items);

  useEffect(() => {
    if (addon) {
      setData({
        id: addonId,
        name: addon.name,
        price: addon.price,
        addonCategoryId: addon.addonCategoryId,
      });
    }
  }, [addon]);

  if (!addon || !data) return null;

  const handleUpdateAddon = () => {
    dispatch(
      updateAddon({
        ...data,
        onSuccess: () => {
          router.push("/backoffice/addons");
          dispatch(setOpenSnackBar({ message: "Successfully updated." }));
        },
      })
    );
  };

  const handleDeleteAddon = () => {
    dispatch(
      deleteAddon({
        id: data.id,
        onSuccess: () => {
          router.push("/backoffice/addons");
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
        <Typography variant="h4">Update Addon</Typography>
      </Box>
      <TextField
        sx={{ mb: 2 }}
        label={"Name"}
        defaultValue={addon.name}
        onChange={(evt) => setData({ ...data, name: evt.target.value })}
      />
      <TextField
        sx={{ mb: 2 }}
        label={"Price"}
        defaultValue={addon.price}
        onChange={(evt) =>
          setData({ ...data, price: Number(evt.target.value) })
        }
      />
      <FormControl fullWidth>
        <InputLabel>Addon Category</InputLabel>
        <Select
          value={data.addonCategoryId}
          onChange={(evt) =>
            setData({
              ...data,
              addonCategoryId: Number(evt.target.value),
            })
          }
          input={<OutlinedInput label="Addon Category" />}
          renderValue={(selectedAddonCategoryId) => {
            return (
              addonCategories.find(
                (item) => item.id === selectedAddonCategoryId
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
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleUpdateAddon}>
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
          <DialogTitle>Confirm delete addon</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this addon?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Disagree</Button>
            <Button onClick={handleDeleteAddon}>Agree</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default UpdateAddonPage;
