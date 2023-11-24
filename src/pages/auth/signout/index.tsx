import { Box, Button, Typography } from "@mui/material";
import { signOut } from "next-auth/react";

const SignOut = () => {
  return (
    <Box>
      <Typography variant="h2">Custom Sign in Page</Typography>
      <Button variant="contained" onClick={() => signOut()}>
        Sign in
      </Button>
    </Box>
  );
};

export default SignOut;
