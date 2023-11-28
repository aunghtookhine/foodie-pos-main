import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

const LandingContent = () => {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        p: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "30%",
        }}
      >
        <Typography variant="h3" color={"primary"}>
          Food ordering system for restaurants
        </Typography>
        <Typography sx={{ fontSize: 20, mt: 2 }}>
          foodiePOS is everything your restaurant needs for you to take orders
          of your customers directly from your website or app while protecting
          your bottom line from third-party aggregators and enabling you to grow
          your revenue.
        </Typography>
        <Button
          variant="contained"
          color="success"
          sx={{ width: "fit-content", p: 1, mt: 2 }}
          onClick={() => router.push("/backoffice")}
        >
          Start free trial
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "40%",
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
