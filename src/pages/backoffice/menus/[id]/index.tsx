import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeAddonCategory } from "@/store/slices/addonCategorySlice";
import { removeMenuAddonCategoryById } from "@/store/slices/menuAddonCategorySlice";
import { deleteMenu, updateMenu } from "@/store/slices/menuSlice";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import { UpdateMenuOptions } from "@/types/menu";
import { config } from "@/utils/config";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { MenuCategory } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

const UpdateMenuPage = () => {
  const router = useRouter();
  const menuId = Number(router.query.id);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<UpdateMenuOptions>();

  const menus = useAppSelector((state) => state.menu.items);
  const menu = menus.find((menu) => menu.id === menuId);

  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const menuCategoryMenus = useAppSelector(
    (state) => state.menuCategoryMenu.items
  );
  const menuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );

  const menuCategoryIds = menuCategoryMenus
    .filter((menuCategoryMenu) => menuCategoryMenu.menuId === menuId)
    .map((item) => item.menuCategoryId);

  const disabledLocationMenus = useAppSelector(
    (state) => state.disabledLocationMenu.items
  );

  useEffect(() => {
    if (menu) {
      const locationId = Number(localStorage.getItem("selectedLocationId"));

      const exist = disabledLocationMenus.find(
        (disabledLocationMenu) =>
          disabledLocationMenu.locationId === locationId &&
          disabledLocationMenu.menuId === menu.id
      );
      const isAvailable = exist ? false : true;
      setData({
        id: menuId,
        name: menu.name,
        price: menu.price,
        menuCategoryIds,
        locationId,
        isAvailable,
      });
    }
  }, [menu, disabledLocationMenus]);

  if (!menu || !data) return null;

  const handleImageChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    if (files) {
      const file = files[0];
      const formData = new FormData();
      formData.append("files", file);
      const response = await fetch(`${config.backofficeApiUrl}/assets`, {
        method: "POST",
        body: formData,
      });
      const { assetUrl } = await response.json();
      dispatch(updateMenu({ ...data, assetUrl }));
    }
  };

  const handleUpdateMenu = () => {
    dispatch(
      updateMenu({
        ...data,
        onSuccess: () => {
          router.push("/backoffice/menus");
          dispatch(setOpenSnackBar({ message: "Successfully updated." }));
        },
      })
    );
  };

  const handleDeleteMenu = () => {
    dispatch(
      deleteMenu({
        id: menuId,
        onSuccess: () => {
          // dispatch(fetchAppData({}));
          menuAddonCategories
            .filter((item) => item.menuId === menuId)
            .map((item) => item.addonCategoryId)
            .forEach((addonCategoryId) => {
              const entries = menuAddonCategories.filter(
                (item) => item.addonCategoryId === addonCategoryId
              );
              if (entries.length === 1) {
                const menuAddonCategoryId = entries[0].id;
                dispatch(removeAddonCategory({ id: addonCategoryId }));
                dispatch(
                  removeMenuAddonCategoryById({ id: menuAddonCategoryId })
                );
              }
            });
          router.push("/backoffice/menus");
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
        <Typography variant="h4">Update Menu</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Image
          src={menu.assetUrl || "/default-menu.png"}
          alt="menu-image"
          width={150}
          height={150}
          style={{ borderRadius: 8 }}
        />
        <Button
          variant="outlined"
          component="label"
          sx={{ width: "fit-content", mt: 2 }}
        >
          Upload File
          <input type="file" hidden onChange={handleImageChange} />
        </Button>
      </Box>
      <TextField
        sx={{ mb: 2 }}
        label={"Name"}
        defaultValue={menu.name}
        onChange={(evt) =>
          setData({ ...data, id: menu.id, name: evt.target.value })
        }
      />
      <TextField
        sx={{ mb: 2 }}
        label={"Price"}
        defaultValue={menu.price}
        onChange={(evt) =>
          setData({ ...data, id: menu.id, price: Number(evt.target.value) })
        }
      />
      <FormControl fullWidth>
        <InputLabel>Menu Category</InputLabel>
        <Select
          multiple
          value={data.menuCategoryIds}
          onChange={(evt) =>
            setData({
              ...data,
              id: menu.id,
              menuCategoryIds: evt.target.value as number[],
            })
          }
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
                checked={data.menuCategoryIds?.includes(menuCategory.id)}
              />
              <ListItemText primary={menuCategory.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={<Switch defaultChecked={data.isAvailable} />}
        onChange={(evt, value) => setData({ ...data, isAvailable: value })}
        label="Available"
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleUpdateMenu}>
          Update
        </Button>
        <Button
          sx={{ ml: 2 }}
          variant="outlined"
          color={"error"}
          onClick={handleDeleteMenu}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateMenuPage;
