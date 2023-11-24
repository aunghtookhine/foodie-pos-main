import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import BackofficeLayout from "./BackofficeLayout";
import OrderAppLayout from "./OrderAppLayout";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const { tableId } = router.query;
  const isOrderApp = tableId;
  const isBackofficeApp = router.pathname.includes("/backoffice");
  if (isOrderApp) {
    return (
      <Box sx={{ height: "100%" }}>
        <OrderAppLayout>{children}</OrderAppLayout>
      </Box>
    );
  } else if (isBackofficeApp) {
    return (
      <Box sx={{ height: "100%" }}>
        <BackofficeLayout>{children}</BackofficeLayout>
      </Box>
    );
  }
  return <Box>{children}</Box>;
};

export default Layout;
