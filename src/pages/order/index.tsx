import MenuCard from "@/components/MenuCard";
import { useAppSelector } from "@/store/hooks";
import { Box, Tab, Tabs } from "@mui/material";
import { MenuCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const OrderApp = () => {
  const { isReady, ...router } = useRouter();
  const query = router.query;
  const { tableId } = query;
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const menuCategoryMenus = useAppSelector(
    (state) => state.menuCategoryMenu.items
  );
  const menus = useAppSelector((state) => state.menu.items);

  const [value, setValue] = useState(0);
  const [selectedMenuCategory, setSelectedMenuCategory] =
    useState<MenuCategory>();

  const renderMenus = () => {
    const validMenuIds = menuCategoryMenus
      .filter(
        (menuCategoryMenu) =>
          menuCategoryMenu.menuCategoryId === selectedMenuCategory?.id
      )
      .map((item) => item.menuId);

    const validMenus = menus.filter((menu) => validMenuIds.includes(menu.id));

    return validMenus.map((item) => (
      <MenuCard
        key={item.id}
        menu={item}
        href={{ pathname: `/order/menus/${item.id}`, query }}
      />
    ));
  };

  useEffect(() => {
    if (menuCategories.length > 0) {
      setSelectedMenuCategory(menuCategories[0]);
    }
  }, [menuCategories]);

  useEffect(() => {
    if (isReady && !tableId) {
      router.push("/");
    }
  }, [isReady]);

  return (
    <Box>
      <Box>
        <Tabs
          value={value}
          TabIndicatorProps={{ sx: { backgroundColor: "#1B9C85 !important" } }}
          onChange={(evt, value) => setValue(value)}
          variant="scrollable"
          sx={{
            ".Mui-selected": {
              fontWeight: "bold",
              color: "#1B9C85 !important",
            },
          }}
        >
          {menuCategories.map((menuCategory) => (
            <Tab
              label={menuCategory.name}
              key={menuCategory.id}
              sx={{ color: "#4C4C6D !important" }}
              onClick={() => setSelectedMenuCategory(menuCategory)}
            />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ display: "flex", mt: 2, flexWrap: "wrap" }}>
        {renderMenus()}
      </Box>
    </Box>
  );
};

export default OrderApp;
