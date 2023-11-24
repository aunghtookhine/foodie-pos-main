import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const TopBar = () => {
  const { data: session } = useSession();
  const selectedLocation = useAppSelector(
    (state) => state.location.selectedLocation
  );
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        bgcolor: "success.main",
      }}
    >
      <Box sx={{ height: "70px" }}>
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
          <Button
            variant="contained"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </Button>
        </Box>
      ) : (
        <span />
      )}
    </Box>
  );
};

export default TopBar;
