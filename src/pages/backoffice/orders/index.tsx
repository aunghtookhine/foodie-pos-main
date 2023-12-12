import OrderCard from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateOrder } from "@/store/slices/orderSlice";
import { OrderItem } from "@/types/order";
import { formatOrders } from "@/utils/generals";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import TimerIcon from "@mui/icons-material/Timer";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";
import { useEffect, useState } from "react";

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const allOrders = useAppSelector((state) => state.order.items);
  const addons = useAppSelector((state) => state.addon.items);
  const menus = useAppSelector((state) => state.menu.items);
  const tables = useAppSelector((state) => state.table.items);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [statusValue, setStatusValue] = useState<ORDERSTATUS>(
    ORDERSTATUS.PENDING
  );
  const selectedLocation = useAppSelector(
    (state) => state.location.selectedLocation
  );

  useEffect(() => {
    if (allOrders.length) {
      const selectedLocationTableIds = tables
        .filter((item) => item.locationId === selectedLocation?.id)
        .map((table) => table.id);
      const orders = allOrders.filter((item) =>
        selectedLocationTableIds.includes(item.tableId)
      );
      const formattedOrders = formatOrders(orders, addons, menus, tables);
      const filtered = formattedOrders.filter(
        (item) => item.status === statusValue
      );
      setOrderItems(filtered);
    }
  }, [allOrders, statusValue]);

  const handleStatusChange = (itemId: string, status: ORDERSTATUS) => {
    dispatch(updateOrder({ itemId, status }));
  };

  if (!allOrders.length) return null;

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
            <TimerIcon />
          </ToggleButton>
          <ToggleButton value={ORDERSTATUS.COOKING}>
            <MicrowaveIcon />
          </ToggleButton>
          <ToggleButton value={ORDERSTATUS.COMPLETE}>
            <CheckCircleIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
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
