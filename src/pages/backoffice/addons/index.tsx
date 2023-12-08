import ItemCard from "@/components/ItemCard";
import NewAddon from "@/components/NewAddon";
import { useAppSelector } from "@/store/hooks";
import EggIcon from "@mui/icons-material/Egg";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const AddonsPage = () => {
  const addon = useAppSelector((state) => state.addon.items);
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant={"contained"} onClick={() => setOpen(true)}>
          Create New Addon
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-start" },
          mt: 2,
        }}
      >
        {addon.map((addon) => (
          <ItemCard
            icon={<EggIcon />}
            title={addon.name}
            key={addon.id}
            href={`/backoffice/addons/${addon.id}`}
          />
        ))}
      </Box>
      <NewAddon open={open} setOpen={setOpen} />
    </Box>
  );
};

export default AddonsPage;
