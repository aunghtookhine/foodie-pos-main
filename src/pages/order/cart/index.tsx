import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { emptyCart, removeFromCart } from "@/store/slices/cartSlice";
import { createOrder } from "@/store/slices/orderSlice";
import { CartItem } from "@/types/cart";
import { getTotalAmount } from "@/utils/generals";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { Addon, Order } from "@prisma/client";
import { useRouter } from "next/router";

const CartPage = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const router = useRouter();
  const query = router.query;
  const tableId = Number(query.tableId);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  const dispatch = useAppDispatch();

  const renderAddons = (addons: Addon[]) => {
    if (!addons.length) return;
    return addons.map((addon) => {
      const category = addonCategories.find(
        (item) => item.id === addon.addonCategoryId
      );
      return (
        <Box
          key={addon.id}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography sx={{ color: "primary.main", fontSize: 20 }}>
            {category?.name} - {addon.name}
          </Typography>
          <Typography sx={{ color: "primary.main", fontSize: 20 }}>
            {addon.price}
          </Typography>
        </Box>
      );
    });
  };
  const handleRemoveFromCart = (cartItem: CartItem) => {
    dispatch(removeFromCart(cartItem));
  };
  const handleOrderConfirm = () => {
    const isValid = tableId;
    if (!isValid) return alert("Table Id");
    dispatch(
      createOrder({
        tableId,
        cartItems,
        onSuccess: (orders: Order[]) => {
          dispatch(emptyCart());
          router.push({
            pathname: `/order/active-order/${orders[0].orderSeq}`,
            query: { tableId },
          });
        },
      })
    );
  };

  return (
    <Box
      sx={{
        borderRadius: 15,
        bgcolor: "info.main",
        p: 3,
        mx: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!cartItems.length ? (
        <Typography variant="h4" sx={{ color: "primary.main" }}>
          You have no order in your cart.
        </Typography>
      ) : (
        <Box sx={{ width: { xs: "100%", md: "80%" }, zIndex: 2 }}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", color: "primary.main" }}
          >
            Review your order
          </Typography>
          <Divider sx={{ my: 3 }} />
          {cartItems.map((cartItem) => {
            const { addons, menu, quantity } = cartItem;
            return (
              <Box key={cartItem.id} sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "success.main" }}>{quantity}</Avatar>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      ml: 3,
                    }}
                  >
                    <Typography variant="h5" sx={{ color: "primary.main" }}>
                      {menu.name}
                    </Typography>
                    <Typography variant="h5" sx={{ color: "primary.main" }}>
                      {menu.price}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ ml: 10 }}>{renderAddons(addons)}</Box>
                <Box sx={{ display: "flex", justifyContent: "end", mt: 1 }}>
                  <IconButton onClick={() => handleRemoveFromCart(cartItem)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname: `menus/${menu.id}`,
                        query: { ...router.query, cartItemId: cartItem.id },
                      });
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: "flex", justifyContent: "end", mb: 3 }}>
            <Typography variant="h3" sx={{ color: "primary.main" }}>
              Total: {getTotalAmount(cartItems)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" onClick={handleOrderConfirm}>
              Confirm your order
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CartPage;
