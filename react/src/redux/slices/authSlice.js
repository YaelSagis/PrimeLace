import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {getMeUser, logInUser, signInUser } from "../../API/usersApi";

export const loadUserThunk=createAsyncThunk('auth/load', async()=> {return await getMeUser() });
export const logInUserThunk=createAsyncThunk('auth/logIn', async(details)=> { return await logInUser(details) });
export const signInUserThunk=createAsyncThunk('auth/signIn', async(user)=> { return await signInUser(user) });

const initialState=
{
    currentUser: null,
    isAuthenticated: false,
    status: 'idle'
};

const authSlice=createSlice(
{
    name: 'auth',
    initialState,
    reducers:
    {
        logOut(state, action)
        {
            state.currentUser = null;
            state.isAuthenticated = false;
            localStorage.removeItem("access");
            localStorage.removeItem("jwtToken");
        },
        addFavorite(state, action)
        {
            if(state.currentUser)
                state.currentUser.favorites.push(action.payload);
        },
        removeFavorite(state, action)
        {
            if (state.currentUser)
                state.currentUser.favorites = state.currentUser.favorites.filter((id) => id !== action.payload);
        }
    },
    extraReducers: (builder)=>
    {
        builder
        .addCase(loadUserThunk.pending, (state)=>
        {
            state.status='loading';
        })
        .addCase(loadUserThunk.fulfilled, (state, action)=>
        {
            state.status='succeeded';
            state.currentUser = action.payload; 
            state.isAuthenticated = true;
        })
        .addCase(loadUserThunk.rejected, (state)=>
        {
            state.status='failed';
            state.currentUser = null;
            state.isAuthenticated = false;
            localStorage.removeItem("jwtToken");
        })
        .addCase(logInUserThunk.pending, (state)=>
        {
            state.status='loading';
        })
        .addCase(logInUserThunk.fulfilled, (state, action)=>
        {
            state.status='succeeded';
            state.currentUser = action.payload.user;
            state.isAuthenticated = true;
            localStorage.setItem("jwtToken", action.payload.token);
        })
        .addCase(logInUserThunk.rejected, (state)=>
        {
            state.status='failed';
        })
        .addCase(signInUserThunk.pending, (state)=>
        {
            state.status='loading';
        })
        .addCase(signInUserThunk.fulfilled, (state, action)=>
        {
            state.status='succeeded';
            state.currentUser = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("jwtToken", action.payload.token);
        })
        .addCase(signInUserThunk.rejected, (state)=>
        {
            state.status='failed';
        })

    }
})

export const {logOut, addFavorite, removeFavorite} = authSlice.actions;
export default authSlice.reducer;