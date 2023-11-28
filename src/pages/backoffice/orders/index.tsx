import OrderCard from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateOrder } from "@/store/slices/orderSlice";
import { OrderItem } from "@/types/order";
import { formatOrders } from "@/utils/generals";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";
import { useEffect, useState } from "react";

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.order.items);
  const addons = useAppSelector((state) => state.addon.items);
  const menus = useAppSelector((state) => state.menu.items);
  const tables = useAppSelector((state) => state.table.items);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [statusValue, setStatusValue] = useState<ORDERSTATUS>(
    ORDERSTATUS.PENDING
  );

  useEffect(() => {
    if (orders.length) {
      const formattedOrders = formatOrders(orders, addons, menus, tables);
      const filtered = formattedOrders.filter(
        (item) => item.status === statusValue
      );
      setOrderItems(filtered);
    }
  }, [orders, statusValue]);

  const handleStatusChange = (itemId: string, status: ORDERSTATUS) => {
    dispatch(updateOrder({ itemId, status }));
  };

  if (!orders.length) return null;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <ToggleButtonGroup
          color="primary"
          value={statusValue}
          exclusive
          onChange={(evt, value) => setStatusValue(value)}
        >
          <ToggleButton value={ORDERSTATUS.PENDING}>
            {ORDERSTATUS.PENDING}
          </ToggleButton>
          <ToggleButton value={ORDERSTATUS.COOKING}>
            {ORDERSTATUS.COOKING}
          </ToggleButton>
          <ToggleButton value={ORDERSTATUS.COMPLETE}>
            {ORDERSTATUS.COMPLETE}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {orderItems.map((orderItem) => {
          return (
            <OrderCard
              key={orderItem.itemId}
              orderItem={orderItem}
              isAdmin={true}
              handleStatusChange={handleStatusChange}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default OrdersPage;
