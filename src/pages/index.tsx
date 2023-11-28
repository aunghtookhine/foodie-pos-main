import LandingContent from "@/components/LandingContent";
import LandingFooter from "@/components/LandingFooter";
import LandingReview from "@/components/LandingReview";
import LandingTopBar from "@/components/LandingTopBar";
import { Box } from "@mui/material";

const HomePage = () => {
  return (
    <Box sx={{ width: "100vw", userSelect: "none" }}>
      <LandingTopBar />
      <Box sx={{ position: "absolute", top: 80, width: "100%" }}>
        <LandingContent />
        <LandingReview />
        <LandingFooter />
      </Box>
    </Box>
  );
};

export default HomePage;
