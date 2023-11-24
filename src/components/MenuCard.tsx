import PaidIcon from "@mui/icons-material/Paid";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Menu } from "@prisma/client";
import Link from "next/link";

interface Props {
  menu: Menu;
  href: string | object;
  isAvailable?: boolean;
}

const MenuCard = ({ menu, href, isAvailable }: Props) => {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          width: 200,
          mr: 2,
          mb: 2,
          opacity: isAvailable === false ? 0.4 : 1,
        }}
      >
        <CardActionArea>
          <CardMedia
            component={"img"}
            height="140"
            sx={{ objectFit: "cover" }}
            image={menu.assetUrl || "/default-menu.png"}
            alt={menu.name}
          />
          <CardContent>
            <Typography sx={{ mb: 1 }} variant="h5">
              {menu.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <PaidIcon color="success" />
              <Typography sx={{ ml: 2 }}>{menu.price}</Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default MenuCard;
