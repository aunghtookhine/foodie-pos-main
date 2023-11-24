import MenuCard from "@/components/MenuCard";
import NewMenu from "@/components/NewMenu";
import { useAppSelector } from "@/store/hooks";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const MenuPage = () => {
  const menus = useAppSelector((state) => state.menu.items);
  const disabledLocationMenus = useAppSelector(
    (state) => state.disabledLocationMenu.items
  );
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => setOpen(true)} variant="contained">
          Create New Menu
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
        {menus.map((menu) => {
          const exist = disabledLocationMenus.find(
            (disabledLocationMenu) =>
              disabledLocationMenu.locationId ===
                Number(localStorage.getItem("selectedLocationId")) &&
              disabledLocationMenu.menuId === menu.id
          );
          const isAvailable = exist ? false : true;
          return (
            <MenuCard
              key={menu.id}
              menu={menu}
              href={`/backoffice/menus/${menu.id}`}
              isAvailable={isAvailable}
            />
          );
        })}
      </Box>
      <NewMenu open={open} setOpen={setOpen} />
    </Box>
  );
};

export default MenuPage;
