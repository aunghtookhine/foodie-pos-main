import { Box, Chip, Divider, Typography } from "@mui/material";
import { Addon, AddonCategory } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import Addons from "./Addons";

interface Props {
  addonCategories: AddonCategory[];
  selectedAddons: Addon[];
  setSelectedAddons: Dispatch<SetStateAction<Addon[]>>;
}

const AddonCategories = ({
  addonCategories,
  selectedAddons,
  setSelectedAddons,
}: Props) => {
  return (
    <Box sx={{ mt: 2 }}>
      {addonCategories.map((addonCategory) => {
        return (
          <Box
            sx={{ mb: 1, bgcolor: "rgba(0,0,0,0.1)", p: 2, borderRadius: 2 }}
            key={addonCategory.id}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="h5" sx={{ userSelect: "none" }}>
                {addonCategory.name}
              </Typography>
              <Chip
                sx={{ userSelect: "none" }}
                label={addonCategory.isRequired ? "Required" : "Optional"}
                color={addonCategory.isRequired ? "primary" : "info"}
              />
            </Box>
            <Divider variant="fullWidth"></Divider>
            <Addons
              addonCategoryId={addonCategory.id}
              selectedAddons={selectedAddons}
              setSelectedAddons={setSelectedAddons}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default AddonCategories;
