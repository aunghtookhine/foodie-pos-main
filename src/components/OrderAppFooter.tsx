import { useAppSelector } from "@/store/hooks";
import { Box, Typography } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";

const OrderAppFooter = () => {
  const router = useRouter();
  const isActiveOrder = router.pathname.includes("/active-order");
  const orders = useAppSelector((state) => state.order.items);
  const showActiveOrdersFooter =
    orders.length &&
    !isActiveOrder &&
    orders
      .map((order) => order.status)
      .some(
        (item) => item === ORDERSTATUS.PENDING || item === ORDERSTATUS.COOKING
      );

  if (!showActiveOrdersFooter) return null;
  return (
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
            pathname: `/order/active-order/${orders[0].orderSeq}`,
            query: router.query,
          }}
          style={{ color: "#ffffff" }}
        >
          here
        </Link>{" "}
        to see your orders.
      </Typography>
    </Box>
  );
};

export default OrderAppFooter;
