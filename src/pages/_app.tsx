import SnackBar from "@/components/SnackBar";
import Layout from "@/components/layout/Layout";
import { store } from "@/store";
import { theme } from "@/utils/theme";
import { ThemeProvider } from "@emotion/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import "../styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
            <SnackBar />
          </Layout>
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
}
