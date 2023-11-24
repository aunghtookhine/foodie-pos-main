import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PrintIcon from "@mui/icons-material/Print";
import { Box, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  href?: string;
  subtitle?: string;
  assetUrl?: string;
  isAvailable?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const ItemCard = ({
  icon,
  title,
  href,
  subtitle,
  isAvailable,
  assetUrl,
  selected,
  onClick,
}: Props) => {
  const handleQRImagePrint = (assetUrl: string) => {
    const imageWindow = window.open();
    imageWindow?.document.write(
      `<html>
        <head>
          <title>QR Print</title>
        </head>
        <body>
          <img src=${assetUrl} onload="window.print();window.close()"/>
        </body>
      </html>`
    );
  };
  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        <Box sx={{ position: "relative", mr: 2, mb: 2 }}>
          <Paper
            elevation={2}
            sx={{
              width: 150,
              height: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              opacity: isAvailable === false ? 0.4 : 1,
            }}
          >
            {icon}
            <Typography
              sx={{
                color: "primary",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                sx={{
                  color: "primary.main",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                {subtitle}
              </Typography>
            )}
            {assetUrl && (
              <Link
                onClick={() => handleQRImagePrint(assetUrl)}
                href={"/backoffice/tables"}
                style={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    px: 1,
                  }}
                >
                  <PrintIcon sx={{ color: "primary.main" }} />
                </Box>
              </Link>
            )}
          </Paper>
        </Box>
      </Link>
    );
  }
  return (
    <Paper
      onClick={() => onClick && onClick()}
      elevation={2}
      sx={{
        width: 150,
        height: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mr: 2,
        mb: 2,
        opacity: isAvailable === false ? 0.4 : 1,
        position: "relative",
        cursor: "pointer",
      }}
    >
      {selected && (
        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <CheckCircleOutlineIcon color={"success"} />
        </Box>
      )}
      {icon}
      <Typography
        sx={{ color: "primary.main", fontWeight: "700", textAlign: "center" }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{ color: "primary.main", fontSize: 14, textAlign: "center" }}
        >
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

export default ItemCard;
