import { useAppSelector } from "@/store/hooks";
import { Home } from "@mui/icons-material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

interface Props {
  cartItemCount: number;
}

const OrderAppHeader = ({ cartItemCount }: Props) => {
  const router = useRouter();
  const tableId = router.query.tableId;
  const isHome = router.pathname === "/order";
  const isCart = router.pathname === "/order/cart";
  const isActiveOrder = router.pathname.includes("/order/activeOrder");
  const isCartOrActiveOrderPage = isCart || isActiveOrder;

  const location = useAppSelector((state) => state.location.items);

  if (!location) return null;

  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "fixed",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: { xs: 40, md: 80, lg: 200 },
          top: 30,
          cursor: "pointer",
        }}
        // onClick={() =>
        //   router.push({ pathname: "/order/cart", query: router.query })
        // }
      >
        {isCartOrActiveOrderPage ? (
          <Home
            onClick={() =>
              router.push({ pathname: "/order", query: router.query })
            }
            sx={{
              fontSize: "40px",
              color: "#FFE194",
            }}
          />
        ) : (
          <>
            <ShoppingCartCheckoutIcon
              onClick={() =>
                router.push({ pathname: "/order/cart", query: { tableId } })
              }
              sx={{
                fontSize: "40px",
                color: "#FFE194",
              }}
            />
            {cartItemCount > 0 && (
              <Typography
                variant="h5"
                sx={{
                  textAlign: "right",
                  color: "#E8F6EF",
                  position: "absolute",
                  top: -10,
                  right: -10,
                }}
              >
                {cartItemCount}
              </Typography>
            )}
          </>
        )}
      </Box>

      <Image
        src={"/order-app-header.svg"}
        alt={"order-app-header"}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
      />
      {isHome && (
        <Box sx={{ position: "absolute", top: -100 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                mt: 15,
              }}
            >
              {location[0].name}
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontStyle: "italic", lineHeight: 1.2 }}
            >
              {location[0].street}
              <br /> {location[0].township}, {location[0].city}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OrderAppHeader;
