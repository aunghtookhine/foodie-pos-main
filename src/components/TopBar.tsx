import { useAppSelector } from "@/store/hooks";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import SideBar from "./SideBar";

const TopBar = () => {
  const { data: session } = useSession();
  const selectedLocation = useAppSelector(
    (state) => state.location.selectedLocation
  );
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 3,
        bgcolor: "success.main",
      }}
    >
      <Box sx={{ height: "70px", display: { xs: "none", sm: "block" } }}>
        <Image
          width={100}
          height={100}
          src={"/logo.png"}
          alt="logo"
          style={{ width: "100%", height: "auto" }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "secondary.main",
        }}
      >
        <Typography variant="h4">Foodie-POS</Typography>
        {selectedLocation && (
          <Typography>{` (${selectedLocation.name})`}</Typography>
        )}
      </Box>
      {session ? (
        <Box>
          <IconButton
            sx={{ display: { xs: "block", sm: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon sx={{ color: "secondary.main", fontSize: 35 }} />
          </IconButton>
          <Button
            variant="contained"
            onClick={() => signOut({ callbackUrl: "/" })}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Sign out
          </Button>
        </Box>
      ) : (
        <span />
      )}
      <Drawer
        anchor={"left"}
        open={drawerOpen}
        onClick={() => setDrawerOpen(false)}
        onClose={() => setDrawerOpen(false)}
      >
        <SideBar />
      </Drawer>
    </Box>
  );
};

export default TopBar;
