import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box, IconButton, Typography } from "@mui/material";

interface Props {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

const QuantitySelector = ({ value, onDecrease, onIncrease }: Props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton color="success" onClick={onDecrease}>
        <RemoveCircleIcon />
      </IconButton>
      <Typography>{value}</Typography>
      <IconButton color="success" onClick={onIncrease}>
        <AddCircleIcon />
      </IconButton>
    </Box>
  );
};

export default QuantitySelector;
