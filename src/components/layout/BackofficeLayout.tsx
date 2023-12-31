import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import SideBar from "../SideBar";
import TopBar from "../TopBar";

interface Props {
  children: ReactNode;
}

const BackofficeLayout = ({ children }: Props) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { init, isLoading } = useAppSelector((state) => state.app);
  const router = useRouter();

  useEffect(() => {
    if (session && !init) {
      dispatch(fetchAppData({}));
    }
    if (!session) {
      router.push("/backoffice");
    }
  }, [session]);

  return (
    <Box>
      <TopBar />
      <Box sx={{ display: "flex" }}>
        {session && (
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            <SideBar />
          </Box>
        )}
        <Box sx={{ p: 3, width: "100%", height: "100%" }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default BackofficeLayout;
