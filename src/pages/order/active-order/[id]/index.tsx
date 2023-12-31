import OrderCard from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { refreshOrder } from "@/store/slices/orderSlice";
import { formatOrders } from "@/utils/generals";
import { Box, Typography } from "@mui/material";
import { Order } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ActiveOrder = () => {
  const router = useRouter();
  const orderSeq = router.query.id;
  const addons = useAppSelector((state) => state.addon.items);
  const allOrders = useAppSelector((state) => state.order.items);
  const orders = allOrders.filter((order) => order.orderSeq === orderSeq);
  const menus = useAppSelector((state) => state.menu.items);
  const tables = useAppSelector((state) => state.table.items);
  const dispatch = useAppDispatch();

  const formattedOrders = formatOrders(orders, addons, menus, tables);
  let intervalId: number;

  useEffect(() => {
    if (orderSeq) {
      intervalId = window.setInterval(handleRefreshOrders, 3000);
    }

    return () => {
      window.clearInterval(intervalId);
    };
  }, [orderSeq]);

  const handleRefreshOrders = () => {
    dispatch(refreshOrder({ orderSeq: String(orderSeq) }));
  };

  const getTotalAmountForActiveOrders = (orders: Order[]) => {
    let itemIds: string[] = [];
    return orders.reduce((prev, curr) => {
      const isExist = itemIds.find((itemId) => itemId === curr.itemId);
      if (!isExist) {
        itemIds = [...itemIds, curr.itemId];
        prev += curr.totalPrice;
      }
      return prev;
    }, 0);
  };

  if (!orders.length || !formattedOrders.length) return null;
  return (
    <Box sx={{ mx: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          p: 3,
          bgcolor: "#E8F6EF",
          borderRadius: 15,
        }}
      >
        <Typography>OrderSeq: {orderSeq}</Typography>
        <Typography>
          Total Price: {getTotalAmountForActiveOrders(orders)}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          mt: 2,
        }}
      >
        {formattedOrders.map((formattedOrder) => {
          return (
            <OrderCard
              key={formattedOrder.itemId}
              orderItem={formattedOrder}
              isAdmin={false}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ActiveOrder;
