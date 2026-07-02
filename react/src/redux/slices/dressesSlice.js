import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllDresses, getDressById, addDress, updateDress, deleteDress, addReview, getAllCategories, getDressesByCategory } from "../../API/dressesAPI";

export const getAllDressesThunk = createAsyncThunk('dresses/getAll', async()=> { return await getAllDresses() });
export const getDressByIdThunk = createAsyncThunk('dresses/getById', async(id)=> { return await getDressById(id) });
export const addDressThunk = createAsyncThunk('dresses/addDress', async(dress)=> { return await addDress(dress) });
export const updateDressThunk = createAsyncThunk('dresses/update', async(dress)=> { return await updateDress(dress) });
export const deleteDressThunk = createAsyncThunk('dresses/delete', async(id)=> { return await deleteDress(id) });
export const addReviewThunk = createAsyncThunk('dresses/addReview', async(review)=> { return await addReview(review) });
export const getAllCategoriesThunk = createAsyncThunk('categories/getAllCategories', async()=> { return await getAllCategories() });
export const getDressesByCategoryThunk = createAsyncThunk('categories/getDressesByCategory', async(id)=> { return await getDressesByCategory(id) });

const initialState=
{
    dresses: [],
    currentDress: null,
    favorites: [],
    dressStatus: 'idle',
    categories: [],       
    categoriesStatus: 'idle'
};

const dressesSlice=createSlice(
    {
        name: 'dresses',
        initialState,
        reducers:
        {
            getAllFavorites(state, action)
            {
                const favoritesIds = action.payload || [];
                state.favorites=state.dresses.filter(d => favoritesIds.includes(d._id));
            },

            updateFavorites(state, action)
            {
                const id = action.payload;
                const dress = state.dresses.find(d => d._id === id);
                if (dress)
                {
                    dress.isFavorite = !dress.isFavorite; 
                }
            }
        },
        extraReducers: (builder) => {
        builder

            .addCase(getAllDressesThunk.pending, function(state) {
                state.dressStatus = 'loading';
            })
            .addCase(getAllDressesThunk.fulfilled, (state, action) => {
                state.dressStatus = 'succeeded';
                state.dresses = action.payload;
            })
            .addCase(getAllDressesThunk.rejected, function(state) {
                state.dressStatus = 'failed';
            })

            .addCase(getDressByIdThunk.pending, function(state) {
                state.dressStatus = 'loading';
            })
            .addCase(getDressByIdThunk.fulfilled, (state, action) => {
                state.dressStatus = 'succeeded';
                state.currentDress = action.payload;
            })
            .addCase(getDressByIdThunk.rejected, function(state) {
                state.dressStatus = 'failed';
            })

            .addCase(addDressThunk.pending, function(state) {
                state.dressStatus = 'loading';
            })
            .addCase(addDressThunk.fulfilled, (state, action) => {
                state.dressStatus = 'succeeded';
                state.dresses.push(action.payload);
            })
            .addCase(addDressThunk.rejected, function(state) {
                state.dressStatus = 'failed';
            })

            .addCase(updateDressThunk.pending, function(state) {
                state.dressStatus = 'loading';
            })
            .addCase(updateDressThunk.fulfilled, (state, action) => {
                state.dressStatus = 'succeeded';
                const updatedDress = action.payload; 
                const id = state.dresses.findIndex(d => d._id === updatedDress.id);
                if (id !== -1) {
                    state.dresses[id] = updatedDress;
                }
            })
            .addCase(updateDressThunk.rejected, function(state) {
                state.dressStatus = 'failed';
            })

            .addCase(deleteDressThunk.pending, function(state) {
                state.dressStatus = 'loading';
            })
            .addCase(deleteDressThunk.fulfilled, (state, action) => {
                state.dressStatus = 'succeeded';
                state.dresses = state.dresses.filter(d => d._id !== action.payload);
            })
            .addCase(deleteDressThunk.rejected, (state) => {
                state.dressStatus = 'failed';
            })

            .addCase(addReviewThunk.pending, function(state) {
                state.dressStatus = 'loading';
            })
            .addCase(addReviewThunk.fulfilled, (state, action) => {
                state.dressStatus = 'succeeded';
                const newReview = action.payload;
                if (state.currentDress && state.currentDress._id === newReview.dressId) {
                    state.currentDress.reviews.push(newReview);
                }
            })
            .addCase(addReviewThunk.rejected, (state) => {
                state.dressStatus = 'failed';
            }) 

            .addCase(getAllCategoriesThunk.pending, function(state) {
                state.categoriesStatus = 'loading';
            })
            .addCase(getAllCategoriesThunk.fulfilled, (state, action) => {
                state.categoriesStatus = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(getAllCategoriesThunk.rejected, (state) => {
                state.categoriesStatus = 'failed';
            }) 

            .addCase(getDressesByCategoryThunk.pending, function(state) {
                state.dressStatus = 'loading'; 
            })
            .addCase(getDressesByCategoryThunk.fulfilled, (state, action) => {
                state.dressStatus = 'succeeded';
                state.dresses = action.payload;
            })
            .addCase(getDressesByCategoryThunk.rejected, (state) => {
                state.dressStatus = 'failed';
            }) 
        }
    }
)

export const {getAllFavorites, updateFavorites}=dressesSlice.actions;
export default dressesSlice.reducer;