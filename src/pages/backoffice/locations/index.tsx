import ItemCard from "@/components/ItemCard";
import NewLocation from "@/components/NewLocation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateSelectedLocation } from "@/store/slices/locationSlice";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const LocationPage = () => {
  const locations = useAppSelector((state) => state.location.items);
  const selectedLocation = useAppSelector(
    (state) => state.location.selectedLocation
  );
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant={"contained"} onClick={() => setOpen(true)}>
          Create New Location
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
        {locations.map((location) => (
          <ItemCard
            key={location.id}
            // href={`/backoffice/locations/${location.id}`}
            title={location.name}
            subtitle={location.street}
            icon={<LocationOnIcon />}
            selected={location.id === selectedLocation?.id}
            onClick={() => dispatch(updateSelectedLocation(location))}
          />
        ))}
      </Box>
      <NewLocation open={open} setOpen={setOpen} />
    </Box>
  );
};

export default LocationPage;
