import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import OrderAppHeader from "../OrderAppHeader";

interface Props {
  children: ReactNode;
}

const OrderAppLayout = ({ children }: Props) => {
  const router = useRouter();
  const isHome = router.pathname === "/order";
  const { tableId } = router.query;
  const dispatch = useAppDispatch();
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const cartItems = useAppSelector((state) => state.cart.items);

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
    </Box>
  );
};

export default OrderAppLayout;
