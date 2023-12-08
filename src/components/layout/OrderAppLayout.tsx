import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box, Typography } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import OrderAppHeader from "../OrderAppHeader";

interface Props {
  children: ReactNode;
}

const OrderAppLayout = ({ children }: Props) => {
  const { isReady, ...router } = useRouter();
  const isHome = router.pathname === "/order";
  const isActiveOrder = router.pathname.includes("/active-order");
  const { tableId } = router.query;
  const dispatch = useAppDispatch();
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const cartItems = useAppSelector((state) => state.cart.items);
  const orders = useAppSelector((state) => state.order.items);
  const showActiveOrdersFooter =
    orders.length &&
    !isActiveOrder &&
    orders
      .map((order) => order.status)
      .some(
        (item) => item === ORDERSTATUS.PENDING || item === ORDERSTATUS.COOKING
      );

  useEffect(() => {
    if (tableId) {
      dispatch(fetchAppData({ tableId: Number(tableId) }));
    }
  }, [tableId]);

  useEffect(() => {
    setCartItemCount(cartItems.length);
  }, [cartItems]);

  if (!isReady) return null;

  return (
    <Box>
      <OrderAppHeader cartItemCount={cartItemCount} />
      <Box
        sx={{
          position: "relative",
          top: isHome ? { sm: 200 } : { xs: 20, sm: 100 },
          zIndex: 3,
          mb: { xs: 8, sm: 20 },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "80%", lg: "55%" },
            m: "0 auto",
          }}
        >
          {children}
        </Box>
      </Box>
      {showActiveOrdersFooter && (
        <Box
          sx={{
            width: "100vw",
            height: 30,
            bgcolor: "primary.main",
            position: "fixed",
            bottom: 0,
            zIndex: 10,
            color: "#ffffff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography sx={{ userSelect: "none" }}>
            Click{" "}
            <Link
              href={{
                pathname: `order/active-order/${orders[0].orderSeq}`,
                query: router.query,
              }}
              style={{ color: "#ffffff" }}
            >
              here
            </Link>{" "}
            to see your orders.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OrderAppLayout;
