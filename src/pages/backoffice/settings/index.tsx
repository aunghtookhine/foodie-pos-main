import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCompany } from "@/store/slices/companySlice";
import { setOpenSnackBar } from "@/store/slices/snackBarSlice";
import { UpdateCompanyOptions } from "@/types/company";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const dispatch = useAppDispatch();

  const [data, setData] = useState<UpdateCompanyOptions>();

  const company = useAppSelector((state) => state.company.item);

  useEffect(() => {
    if (company) {
      setData({
        id: company.id,
        name: company.name,
        street: company.street,
        township: company.township,
        city: company.city,
      });
    }
  }, [company]);

  if (!company || !data) return null;

  const handleUpdateCompany = () => {
    dispatch(
      updateCompany({
        ...data,
        onSuccess: () => {
          dispatch(setOpenSnackBar({ message: "Successfully updated." }));
        },
      })
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Update Company</Typography>
      </Box>
      <TextField
        sx={{ mb: 2 }}
        label={"Name"}
        defaultValue={company.name}
        onChange={(evt) => setData({ ...data, name: evt.target.value })}
      />
      <TextField
        sx={{ mb: 2 }}
        label={"Street"}
        defaultValue={company.street}
        onChange={(evt) => setData({ ...data, street: evt.target.value })}
      />
      <TextField
        sx={{ mb: 2 }}
        label={"Township"}
        defaultValue={company.township}
        onChange={(evt) => setData({ ...data, township: evt.target.value })}
      />
      <TextField
        sx={{ mb: 2 }}
        label={"City"}
        defaultValue={company.city}
        onChange={(evt) => setData({ ...data, city: evt.target.value })}
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleUpdateCompany}>
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
