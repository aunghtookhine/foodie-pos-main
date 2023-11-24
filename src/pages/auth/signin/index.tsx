import { Box, Button, Typography } from "@mui/material";
import { signIn } from "next-auth/react";

const SignIn = () => {
  return (
    <Box>
      <Typography variant="h2">Custom Sign in Page</Typography>
      <Button
        variant="contained"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Sign in
      </Button>
    </Box>
  );
};

export default SignIn;
