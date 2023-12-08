import CategoryIcon from "@mui/icons-material/Category";
import ClassIcon from "@mui/icons-material/Class";
import EggIcon from "@mui/icons-material/Egg";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SettingsIcon from "@mui/icons-material/Settings";
import TableBarIcon from "@mui/icons-material/TableBar";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";

export const sidebarMenuItems = [
  {
    id: 1,
    label: "Orders",
    icon: <LocalMallIcon />,
    route: "/backoffice/orders",
  },
  {
    id: 2,
    label: "Menu Categories",
    icon: <CategoryIcon />,
    route: "/backoffice/menu-categories",
  },
  {
    id: 3,
    label: "Menus",
    icon: <LocalDiningIcon />,
    route: "/backoffice/menus",
  },
  {
    id: 4,
    label: "Addon Categories",
    icon: <ClassIcon />,
    route: "/backoffice/addon-categories",
  },
  {
    id: 5,
    label: "Addons",
    icon: <EggIcon />,
    route: "/backoffice/addons",
  },
  {
    id: 6,
    label: "Tables",
    icon: <TableBarIcon />,
    route: "/backoffice/tables",
  },
  {
    id: 7,
    label: "Locations",
    icon: <LocationOnIcon />,
    route: "/backoffice/locations",
  },
  {
    id: 8,
    label: "Settings",
    icon: <SettingsIcon />,
    route: "/backoffice/settings",
  },
];

const SideBar = () => {
  return (
    <Box
      sx={{
        minWidth: "250px",
        bgcolor: "success.main",
        borderTopRightRadius: { xs: 0, sm: 20 },
        minHeight: "100vh",
      }}
    >
      <List sx={{ p: 0 }}>
        {sidebarMenuItems.slice(0, 7).map((item) => (
          <Link
            href={item.route}
            key={item.id}
            style={{ textDecoration: "none" }}
          >
            <ListItem
              disablePadding
              sx={{ "&.hover": { backgroundColor: "blue" } }}
            >
              <ListItemButton>
                <ListItemIcon sx={{ color: "info.main" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ color: "info.main" }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider
        variant={"middle"}
        sx={{ backgroundColor: "secondary.main", mt: 2 }}
      />
      <List>
        {sidebarMenuItems.slice(-1).map((item) => (
          <Link
            href={item.route}
            key={item.id}
            style={{ textDecoration: "none", color: "#ffffff" }}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: "#ffffff" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default SideBar;
