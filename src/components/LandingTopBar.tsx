import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";

const LandingTopBar = () => {
  const router = useRouter();
  return (
    <Box
      sx={{
        height: 80,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        position: "fixed",
        top: 0,
        width: "100%",
        bgcolor: "#ffffff",
        zIndex: 9,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" color={"primary"}>
        foodiePOS
      </Typography>
      <Button
        variant="contained"
        color="success"
        onClick={() => router.push("/backoffice")}
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        Start free trial
      </Button>
    </Box>
  );
};

export default LandingTopBar;
