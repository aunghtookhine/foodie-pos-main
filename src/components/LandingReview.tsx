import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

const LandingReview = () => {
  return (
    <Box
      sx={{
        bgcolor: "info.main",
        p: 3,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: "primary.main",
          textAlign: "center",
          my: 5,
        }}
      >
        Our customers love foodiePOS!
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-evenly", mb: 5 }}>
        <Box sx={{ bgcolor: "#ffffff", width: 300, p: 5, borderRadius: 10 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <FormatQuoteRoundedIcon
              sx={{ fontSize: 50, color: "primary.main" }}
            />
          </Box>
          <Typography sx={{ fontStyle: "italic" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, quidem
            eaque numquam provident minus veniam!
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Image
              src={"/pic1.jpeg"}
              alt={"profile-1"}
              width={100}
              height={100}
              style={{ borderRadius: 50 }}
            />
            <Box sx={{ ml: 3 }}>
              <Typography sx={{ fontWeight: "bold" }}>John Doe</Typography>
              <Typography>CEO of Kyate Htar</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ bgcolor: "#ffffff", width: 300, p: 5, borderRadius: 10 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <FormatQuoteRoundedIcon
              sx={{ fontSize: 50, color: "primary.main" }}
            />
          </Box>
          <Typography sx={{ fontStyle: "italic" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, quidem
            eaque numquam provident minus veniam!
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Image
              src={"/pic2.jpeg"}
              alt={"profile-2"}
              width={100}
              height={100}
              style={{ borderRadius: 50 }}
            />
            <Box sx={{ ml: 3 }}>
              <Typography sx={{ fontWeight: "bold" }}>
                Amelia Aniston
              </Typography>
              <Typography>CEO of Bike Sar</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ bgcolor: "#ffffff", width: 300, p: 5, borderRadius: 10 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <FormatQuoteRoundedIcon
              sx={{ fontSize: 50, color: "primary.main" }}
            />
          </Box>
          <Typography sx={{ fontStyle: "italic" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, quidem
            eaque numquam provident minus veniam!
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Image
              src={"/pic3.jpeg"}
              alt={"profile-3"}
              width={100}
              height={100}
              style={{ borderRadius: 50 }}
            />
            <Box sx={{ ml: 3 }}>
              <Typography sx={{ fontWeight: "bold" }}>Mac Authur</Typography>
              <Typography>CEO of Ah Myan Sarr</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingReview;
