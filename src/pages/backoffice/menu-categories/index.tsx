import ItemCard from "@/components/ItemCard";
import NewMenuCategory from "@/components/NewMenuCategory";
import { useAppSelector } from "@/store/hooks";
import CategoryIcon from "@mui/icons-material/Category";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const MenuCategoriesPage = () => {
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const disabledLocationMenuCategories = useAppSelector(
    (state) => state.disabledLocationMenuCategory.items
  );
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant={"contained"} onClick={() => setOpen(true)}>
          Create New Menu Category
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
        {menuCategories.map((menuCategory) => {
          const exist = disabledLocationMenuCategories.find(
            (disabledLocationMenuCategory) =>
              disabledLocationMenuCategory.menuCategoryId === menuCategory.id &&
              disabledLocationMenuCategory.locationId ===
                Number(localStorage.getItem("selectedLocationId"))
          );
          const isAvailable = exist ? false : true;
          return (
            <ItemCard
              key={menuCategory.id}
              icon={<CategoryIcon />}
              title={menuCategory.name}
              href={`/backoffice/menu-categories/${menuCategory.id}`}
              isAvailable={isAvailable}
            />
          );
        })}
      </Box>
      <NewMenuCategory open={open} setOpen={setOpen} />
    </Box>
  );
};

export default MenuCategoriesPage;
