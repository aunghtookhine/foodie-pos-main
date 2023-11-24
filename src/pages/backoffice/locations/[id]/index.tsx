import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteLocation, updateLocation } from "@/store/slices/locationSlice";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import { UpdateLocationOptions } from "@/types/location";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const UpdateLocationPage = () => {
  const router = useRouter();
  const locationId = Number(router.query.id);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<UpdateLocationOptions>();

  const locations = useAppSelector((state) => state.location.items);
  const location = locations.find((location) => location.id === locationId);

  useEffect(() => {
    if (location) {
      setData({
        id: locationId,
        name: location.name,
        street: location.street,
        township: location.township,
        city: location.city,
        companyId: location.companyId,
      });
    }
  }, [location]);

  if (!location || !data) return null;

  const handleUpdateLocation = () => {
    dispatch(
      updateLocation({
        ...data,
        onSuccess: () => {
          router.push("/backoffice/locations");
          dispatch(setOpenSnackBar({ message: "Successfully updated." }));
        },
      })
    );
  };

  const handleDeleteLocation = () => {
    dispatch(
      deleteLocation({
        id: locationId,
        onSuccess: () => {
          router.push("/backoffice/locations");
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
        <Typography variant="h4">Update Location</Typography>
        <Button
          variant="outlined"
          color={"error"}
          onClick={handleDeleteLocation}
        >
          Delete
        </Button>
      </Box>
      <TextField
        sx={{ mb: 2 }}
        label={"Name"}
        defaultValue={location.name}
        onChange={(evt) => setData({ ...data, name: evt.target.value })}
      />
      <TextField
        sx={{ mb: 2 }}
        label={"Street"}
        defaultValue={location.street}
        onChange={(evt) => setData({ ...data, street: evt.target.value })}
      />
      <TextField
        sx={{ mb: 2 }}
        label={"Township"}
        defaultValue={location.township}
        onChange={(evt) => setData({ ...data, township: evt.target.value })}
      />
      <TextField
        sx={{ mb: 2 }}
        label={"City"}
        defaultValue={location.city}
        onChange={(evt) => setData({ ...data, city: evt.target.value })}
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleUpdateLocation}>
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateLocationPage;
