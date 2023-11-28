import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

const LandingContent = () => {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: { xs: "block", lg: "flex" },
        justifyContent: "space-evenly",
        alignItems: "center",
        p: { xs: 4, lg: 5 },
      }}
    >
      <Box
        sx={{
          display: { xs: "block", lg: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          width: { xs: "100%", lg: "30%" },
        }}
      >
        <Typography
          variant="h3"
          color={"primary"}
          sx={{ textAlign: { xs: "center", lg: "start" } }}
        >
          Food ordering system for restaurants
        </Typography>
        <Typography
          sx={{ fontSize: 20, mt: 2, textAlign: { xs: "center", lg: "start" } }}
        >
          foodiePOS is everything your restaurant needs for you to take orders
          of your customers directly from your website or app while protecting
          your bottom line from third-party aggregators and enabling you to grow
          your revenue.
        </Typography>
        <Box sx={{ textAlign: { xs: "center", lg: "start" }, my: 2 }}>
          <Button
            variant="contained"
            color="success"
            sx={{ width: "fit-content", p: 1 }}
            onClick={() => router.push("/backoffice")}
          >
            Start free trial
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: { xs: "100%", lg: "40%" },
        }}
      >
        <Image
          src={"/landing-order.jpg"}
          alt="landing-order"
          width={0}
          height={0}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 20,
          }}
        />
      </Box>
    </Box>
  );
};

export default LandingContent;
