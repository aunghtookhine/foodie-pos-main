import OrderCard from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { refreshOrder } from "@/store/slices/orderSlice";
import { formatOrders } from "@/utils/generals";
import { Box } from "@mui/material";
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

  useEffect(() => {
    if (orderSeq) {
      setInterval(handleRefreshOrders, 10000);
    }
  }, [orderSeq]);

  const handleRefreshOrders = () => {
    dispatch(refreshOrder({ orderSeq: String(orderSeq) }));
  };

  return (
    <Box sx={{ mx: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 3,
          bgcolor: "#E8F6EF",
          borderRadius: 15,
        }}
      >
        OrderSeq: {orderSeq}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
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
