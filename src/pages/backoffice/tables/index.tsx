import ItemCard from "@/components/ItemCard";
import NewTable from "@/components/NewTable";
import { useAppSelector } from "@/store/hooks";
import TableBar from "@mui/icons-material/TableBar";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const TablePage = () => {
  const tables = useAppSelector((state) => state.table.items);
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => setOpen(true)} variant="contained">
          Create New Table
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
        {tables.map((table) => (
          <ItemCard
            key={table.id}
            icon={<TableBar />}
            title={table.name}
            href={`/backoffice/tables/${table.id}`}
            subtitle={String(table.locationId)}
            assetUrl={table.assetUrl}
          />
        ))}
      </Box>
      <NewTable open={open} setOpen={setOpen} />
    </Box>
  );
};

export default TablePage;
