import { configureStore } from "@reduxjs/toolkit";
import dressesReducer from "./slices/dressesSlice";
import authReducer from "./slices/authSlice"
import categoriesReduer from "./slices/categoriesSlice"

export const store=configureStore(
    {
        reducer:
        {
            dresses: dressesReducer,
            auth: authReducer,
            categories: categoriesReduer
        }
    }
);

export default store;