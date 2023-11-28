import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

const LandingReview = () => {
  const data = [
    {
      id: 1,
      name: "John Doe",
      href: "/pic1.jpeg",
      position: "CEO of Kyate Htar",
    },
    {
      id: 2,
      name: "Amelia Aniston",
      href: "/pic2.jpeg",
      position: "CEO of Bike Sar",
    },
    {
      id: 3,
      name: "Mac Arthur",
      href: "/pic3.jpeg",
      position: "CEO of Ah Myan Sarr",
    },
  ];
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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-evenly",
          alignItems: "center",
          mb: 5,
          width: "100%",
        }}
      >
        {data.map((item) => (
          <Box
            key={item.id}
            sx={{
              bgcolor: "#ffffff",
              width: { xs: "80%", sm: "40%", lg: "20%" },
              p: { xs: 3, lg: 5 },
              borderRadius: 10,
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <FormatQuoteRoundedIcon
                sx={{ fontSize: 50, color: "primary.main" }}
              />
            </Box>
            <Typography sx={{ fontStyle: "italic" }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel,
              quidem eaque numquam provident minus veniam!
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                alignItems: "center",
                mt: 2,
              }}
            >
              <Image
                src={item.href}
                alt={"profile"}
                width={100}
                height={100}
                style={{ borderRadius: 50 }}
              />
              <Box
                sx={{
                  ml: { lg: 3 },
                  mt: { xs: 3, lg: 0 },
                  textAlign: { xs: "center", lg: "start" },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {item.name}
                </Typography>
                <Typography sx={{}}>{item.position}</Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LandingReview;
