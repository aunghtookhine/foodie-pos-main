import ItemCard from "@/components/ItemCard";
import NewAddonCategory from "@/components/NewAddonCategory";
import { useAppSelector } from "@/store/hooks";
import ClassIcon from "@mui/icons-material/Class";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const AddonCategoriesPage = () => {
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant={"contained"} onClick={() => setOpen(true)}>
          Create New Addon Category
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
        {addonCategories.map((addonCategory) => (
          <ItemCard
            title={addonCategory.name}
            key={addonCategory.id}
            href={`/backoffice/addon-categories/${addonCategory.id}`}
            icon={<ClassIcon />}
          />
        ))}
      </Box>
      <NewAddonCategory open={open} setOpen={setOpen} />
    </Box>
  );
};

export default AddonCategoriesPage;
