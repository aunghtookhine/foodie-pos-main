import { useAppSelector } from "@/store/hooks";
import { OrderItem } from "@/types/order";
import { Box, Card, MenuItem, Select, Typography } from "@mui/material";
import { AddonCategory, ORDERSTATUS } from "@prisma/client";

interface Props {
  orderItem: OrderItem;
  handleStatusChange?: (itemId: string, status: ORDERSTATUS) => void;
  isAdmin: boolean;
}

const OrderCard = ({ orderItem, handleStatusChange, isAdmin }: Props) => {
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  return (
    <Card sx={{ width: 280, height: 280, mr: 2, mb: 2 }}>
      <Box
        sx={{
          hieght: 40,
          bgcolor: "primary.main",
          display: "flex",
          justifyContent: "space-between",
          p: 1,
          color: "#ffffff",
        }}
      >
        <Typography>{orderItem.menu.name}</Typography>
        <Typography>{orderItem.table.name}</Typography>
      </Box>
      <Box sx={{ px: 2 }}>
        <Box
          sx={{
            height: 250 * 0.15,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid lightgray",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Item Id :</Typography>
          <Typography>{orderItem.itemId}</Typography>
        </Box>
        <Box
          sx={{
            height: 250 * 0.6,
            overflow: "auto",
          }}
        >
          {orderItem.orderAddons.map((orderAddon) => {
            const addonCategory = addonCategories.find(
              (addonCategory) => addonCategory.id === orderAddon.addonCategoryId
            ) as AddonCategory;
            return (
              <Box key={orderAddon.addonCategoryId}>
                <Typography>{addonCategory.name}</Typography>
                {orderAddon.addons.map((addon) => {
                  return (
                    <Typography
                      key={addon.id}
                      sx={{
                        fontSize: 14,
                        fontStyle: "italic",
                        fontWeight: "bold",
                        ml: 2,
                      }}
                    >
                      {addon.name}
                    </Typography>
                  );
                })}
              </Box>
            );
          })}
        </Box>
        <Box
          sx={{
            height: 250 * 0.15,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid lightgray",
            pt: 1,
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Status:</Typography>
          {isAdmin ? (
            <Select
              value={orderItem.status}
              onChange={(evt) => {
                handleStatusChange &&
                  handleStatusChange(
                    orderItem.itemId,
                    evt.target.value as ORDERSTATUS
                  );
              }}
              sx={{ height: 30 }}
            >
              <MenuItem value={ORDERSTATUS.PENDING}>
                {ORDERSTATUS.PENDING}
              </MenuItem>
              <MenuItem value={ORDERSTATUS.COOKING}>
                {ORDERSTATUS.COOKING}
              </MenuItem>
              <MenuItem value={ORDERSTATUS.COMPLETE}>
                {ORDERSTATUS.COMPLETE}
              </MenuItem>
            </Select>
          ) : (
            <Typography>{orderItem.status}</Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default OrderCard;
