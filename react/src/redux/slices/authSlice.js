import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addToFavorites, getMeUser, logInUser, removeFromFavorites, signInUser } from "../../API/usersApi";

export const loadUserThunk = createAsyncThunk('auth/load', async () => { return await getMeUser(); });
export const logInUserThunk = createAsyncThunk('auth/logIn', async (details) => { return await logInUser(details); });
export const signInUserThunk = createAsyncThunk('auth/signIn', async (user) => { return await signInUser(user); });
export const addToFavoritesThunk = createAsyncThunk('auth/addToFavorites', async (dressId) => { await addToFavorites(dressId); return dressId; });
export const removeFromFavoritesThunk = createAsyncThunk('auth/removeFromFavorites', async (dressId) => { await removeFromFavorites(dressId); return dressId; });

const initialState = {
    currentUser: null,
    isAuthenticated: false,
    status: 'idle' 
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut(state) {
            state.currentUser = null;
            state.isAuthenticated = false;
            state.status = 'idle';
            localStorage.removeItem("jwtToken");
        },
    },
    extraReducers:
     (builder) => {
        builder
            .addCase(loadUserThunk.pending, (state) => { state.status = 'loading'; })
            .addCase(loadUserThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const user = action.payload;
                if (user) {
                    if (!user.favorites) user.favorites = [];
                    state.currentUser = user;
                    state.isAuthenticated = true;
                } else {
                    state.currentUser = null;
                    state.isAuthenticated = false;
                }
            })
            .addCase(loadUserThunk.rejected, (state) => {
                state.status = 'failed';
                state.currentUser = null;
                state.isAuthenticated = false;
                localStorage.removeItem("jwtToken");
            })
            .addCase(logInUserThunk.pending, (state) => { state.status = 'loading'; })
            .addCase(logInUserThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const user = action.payload.user;
                if (user && !user.favorites) user.favorites = [];
                state.currentUser = user;
                state.isAuthenticated = true;
                localStorage.setItem("jwtToken", action.payload.token);
            })
            .addCase(logInUserThunk.rejected, (state) => { state.status = 'failed'; })
            .addCase(signInUserThunk.pending, (state) => { state.status = 'loading'; })
            .addCase(signInUserThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const user = action.payload.user;
                if (user && !user.favorites) user.favorites = [];
                state.currentUser = user;
                state.isAuthenticated = true;
                localStorage.setItem("jwtToken", action.payload.token);
            })
            .addCase(signInUserThunk.rejected, (state) => { state.status = 'failed'; })
            .addCase(addToFavoritesThunk.fulfilled, (state, action) => {
                if (state.currentUser) {
                    if (!state.currentUser.favorites) 
                        state.currentUser.favorites = [];
                    if (!state.currentUser.favorites.includes(action.payload)) {
                        state.currentUser.favorites.push(action.payload);
                    }
                }
            })
            .addCase(removeFromFavoritesThunk.fulfilled, (state, action) => {
                if (state.currentUser && state.currentUser.favorites) {
                    state.currentUser.favorites = state.currentUser.favorites.filter((id) => id !== action.payload);
                }
            });
    }
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;