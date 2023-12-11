import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import OrderAppFooter from "../OrderAppFooter";
import OrderAppHeader from "../OrderAppHeader";

interface Props {
  children: ReactNode;
}

const OrderAppLayout = ({ children }: Props) => {
  const { isReady, ...router } = useRouter();
  const isHome = router.pathname === "/order";

  const { tableId } = router.query;
  const dispatch = useAppDispatch();
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const cartItems = useAppSelector((state) => state.cart.items);
  const { isLoading } = useAppSelector((state) => state.app);

  useEffect(() => {
    if (tableId) {
      dispatch(fetchAppData({ tableId: Number(tableId) }));
    }
  }, [tableId]);

  useEffect(() => {
    setCartItemCount(cartItems.length);
  }, [cartItems]);

  // if (!isReady) return null;

  return (
    <Box>
      {isLoading ? (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
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
          <OrderAppFooter />
        </>
      )}
    </Box>
  );
};

export default OrderAppLayout;
