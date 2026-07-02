import { configureStore } from "@reduxjs/toolkit";
import dressesReducer from "./slices/dressesSlice";
import authReducer from "./slices/authSlice"

export const store=configureStore(
    {
        reducer:
        {
            dresses: dressesReducer,
            auth: authReducer
        }
    }
);

export default store;