import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box, IconButton, Typography } from "@mui/material";

const LandingFooter = () => {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-around",
        alignItems: "center",
        p: 3,
        color: "#ffffff",
      }}
    >
      <Box sx={{ mb: 2, textAlign: { xs: "center", lg: "start" } }}>
        <Typography>© foodiePOS</Typography>
        <Typography>Privacy Policy | Terms of service</Typography>
      </Box>
      <Box>
        <Typography sx={{ textAlign: "center" }}>Social Apps</Typography>
        <IconButton>
          <FacebookIcon sx={{ color: "#ffffff" }} />
        </IconButton>
        <IconButton>
          <TwitterIcon sx={{ color: "#ffffff" }} />
        </IconButton>
        <IconButton>
          <InstagramIcon sx={{ color: "#ffffff" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default LandingFooter;
