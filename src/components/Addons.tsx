import { useAppSelector } from "@/store/hooks";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { Addon } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface Props {
  addonCategoryId: number;
  selectedAddons: Addon[];
  setSelectedAddons: Dispatch<SetStateAction<Addon[]>>;
}

const Addons = ({
  addonCategoryId,
  selectedAddons,
  setSelectedAddons,
}: Props) => {
  const allAddons = useAppSelector((state) => state.addon.items);
  const addons = allAddons.filter(
    (addon) => addon.addonCategoryId === addonCategoryId
  );
  const addonIds = addons.map((item) => item.id);
  const addonCategory = useAppSelector(
    (state) => state.addonCategory.items
  ).find((item) => item.id === addonCategoryId);

  if (!addonCategory) return null;
  return (
    <Box>
      {addons.map((addon) => {
        return (
          <Box
            key={addon.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {addonCategory.isRequired ? (
              <FormControlLabel
                control={
                  <Radio
                    color="success"
                    checked={
                      selectedAddons.find((item) => item.id === addon.id)
                        ? true
                        : false
                    }
                    onChange={() => {
                      const others = selectedAddons.filter(
                        (item) => !addonIds.includes(item.id)
                      );
                      setSelectedAddons([...others, addon]);
                    }}
                  />
                }
                label={addon.name}
              />
            ) : (
              <FormControlLabel
                control={<Checkbox color="success" />}
                label={addon.name}
                checked={
                  selectedAddons.find((item) => item.id === addon.id)
                    ? true
                    : false
                }
                onChange={(evt, value) => {
                  if (value) {
                    setSelectedAddons([...selectedAddons, addon]);
                  } else {
                    const others = selectedAddons.filter(
                      (item) => item.id !== addon.id
                    );
                    setSelectedAddons(others);
                  }
                }}
              />
            )}
            <Typography sx={{ fontStyle: "italic", userSelect: "none" }}>
              {addon.price} Kyats
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default Addons;
