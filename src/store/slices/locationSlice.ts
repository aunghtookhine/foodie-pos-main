import {
  CreateNewLocationOptions,
  DeleteLocationOptions,
  LocationSlice,
  UpdateLocationOptions,
} from "@/types/location";
import { config } from "@/utils/config";
import { Location } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: LocationSlice = {
  items: [],
  selectedLocation: null,
  isLoading: false,
  error: null,
};

export const createLocation = createAsyncThunk(
  "location/createNewLocation",
  async (options: CreateNewLocationOptions, thunkApi) => {
    const { name, street, township, city, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/location`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, street, township, city }),
      });
      const location = await response.json();
      thunkApi.dispatch(addLocation(location));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const updateLocation = createAsyncThunk(
  "location/updateLocation",
  async (options: UpdateLocationOptions, thunkApi) => {
    const { id, name, street, township, city, companyId, onSuccess, onError } =
      options;
    try {
      const response = await fetch(`${config.backofficeApiUrl}/location`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, street, township, city, companyId }),
      });
      const location = await response.json();
      thunkApi.dispatch(replaceLocation(location));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const deleteLocation = createAsyncThunk(
  "location/deleteLocation",
  async (options: DeleteLocationOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.backofficeApiUrl}/location?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(removeLocation({ id }));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocations: (state, action: PayloadAction<Location[]>) => {
      state.items = action.payload;
      const selectedLocationId = localStorage.getItem("selectedLocationId");
      if (!selectedLocationId) {
        localStorage.setItem(
          "selectedLocationId",
          String(action.payload[0].id)
        );
        state.selectedLocation = action.payload[0];
      } else {
        const selectedLocation = state.items.find(
          (item) => item.id === Number(selectedLocationId)
        ) as Location;
        if (selectedLocation) {
          state.selectedLocation = selectedLocation;
        }
      }
    },
    addLocation: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceLocation: (state, action) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeLocation: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      const firstLocationId = state.items[0].id;
      localStorage.setItem("selectedLocationId", String(firstLocationId));
    },
    updateSelectedLocation: (state, action: PayloadAction<Location>) => {
      state.selectedLocation = action.payload;
      localStorage.setItem("selectedLocationId", String(action.payload.id));
    },
  },
});

export const {
  setLocations,
  addLocation,
  replaceLocation,
  removeLocation,
  updateSelectedLocation,
} = locationSlice.actions;
export default locationSlice.reducer;
