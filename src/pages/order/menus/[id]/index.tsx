import AddonCategories from "@/components/AddonCategories";
import QuantitySelector from "@/components/QuantitySelector";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { CartItem } from "@/types/cart";
import { Box, Button } from "@mui/material";
import { Addon } from "@prisma/client";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MenuDetail = () => {
  const { isReady, ...router } = useRouter();
  const query = router.query;
  const tableId = query.tableId;
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const onDecrease = () => {
    const newQuantity = quantity - 1 === 0 ? 1 : quantity - 1;
    setQuantity(newQuantity);
  };
  const onIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
  };

  const menuId = Number(router.query.id);
  const menus = useAppSelector((state) => state.menu.items);
  const menu = menus.find((menu) => menu.id === menuId);

  const allAddonCategories = useAppSelector(
    (state) => state.addonCategory.items
  );
  const menuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );
  const addonCategoryIds = menuAddonCategories
    .filter((item) => item.menuId === menuId)
    .map((item) => item.addonCategoryId);
  const addonCategories = allAddonCategories.filter((item) =>
    addonCategoryIds.includes(item.id)
  );

  useEffect(() => {
    const requiredAddonCategories = addonCategories.filter(
      (item) => item.isRequired
    );

    const selectedRequiredAddons = selectedAddons.filter((item) => {
      const addonCategory = addonCategories.find(
        (addonCategory) => addonCategory.id === item.addonCategoryId
      );
      return addonCategory?.isRequired ? true : false;
    });

    const isDisabled =
      requiredAddonCategories.length !== selectedRequiredAddons.length;
    setIsDisabled(isDisabled);
  }, [selectedAddons]);

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemId = query.cartItemId;
  const cartItem = cartItems.find((item) => item.id === cartItemId);

  useEffect(() => {
    if (cartItem) {
      const { addons, quantity } = cartItem;
      setSelectedAddons(addons);
      setQuantity(quantity);
    }
  }, [cartItem]);

  const handleAddToCart = () => {
    if (!menu) return;
    const newCartItem: CartItem = {
      id: cartItem ? cartItem.id : nanoid(7),
      menu,
      addons: selectedAddons,
      quantity,
    };
    dispatch(addToCart(newCartItem));
    const pathname = cartItem ? "/order/cart" : "/order";
    router.push({ pathname, query: { tableId } });
  };

  if (!menu || !isReady) return null;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Image
        src={menu.assetUrl || "/default-menu.png"}
        alt={"menu-img"}
        width={150}
        height={150}
        style={{
          border: "3px solid #4C4C6D",
          borderRadius: 100,
          backgroundColor: "#ffffff",
          zIndex: 3,
        }}
      />
      <Box sx={{ zIndex: 3 }}>
        <AddonCategories
          addonCategories={addonCategories}
          selectedAddons={selectedAddons}
          setSelectedAddons={setSelectedAddons}
        />
      </Box>
      <QuantitySelector
        value={quantity}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
      />
      <Button
        sx={{ width: "fit-content", mt: 2, mb: 5 }}
        variant="contained"
        onClick={handleAddToCart}
        disabled={isDisabled}
      >
        {cartItem ? "Update cart" : "Add to cart"}
      </Button>
    </Box>
  );
};

export default MenuDetail;
