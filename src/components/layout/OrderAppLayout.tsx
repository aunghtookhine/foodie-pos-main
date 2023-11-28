import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import OrderAppHeader from "../OrderAppHeader";

interface Props {
  children: ReactNode;
}

const OrderAppLayout = ({ children }: Props) => {
  const router = useRouter();
  const isHome = router.pathname === "/order";
  const isActiveOrder = router.pathname.includes("/active-order");
  const { tableId } = router.query;
  const dispatch = useAppDispatch();
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const cartItems = useAppSelector((state) => state.cart.items);
  const orders = useAppSelector((state) => state.order.items);

  useEffect(() => {
    if (tableId) {
      dispatch(fetchAppData({ tableId: Number(tableId) }));
    }
  }, [tableId]);

  useEffect(() => {
    setCartItemCount(cartItems.length);
  }, [cartItems]);

  return (
    <Box>
      <OrderAppHeader cartItemCount={cartItemCount} />
      <Box sx={{ position: "relative", top: isHome ? 200 : 100, zIndex: 3 }}>
        <Box
          sx={{
            width: { xs: "100%", md: "80%", lg: "55%" },
            m: "0 auto",
          }}
        >
          {children}
        </Box>
      </Box>
      {orders.length && !isActiveOrder && (
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
