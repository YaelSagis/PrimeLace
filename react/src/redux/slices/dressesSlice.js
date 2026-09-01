import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllDresses, getDressById, addDress, updateDress, deleteDress, addReview, getPopularDresses} from "../../API/dressesApi";
import { getDressesByCategory } from "../../API/categoriesApi";

export const getAllDressesThunk = createAsyncThunk('dresses/getAll', async()=> { return await getAllDresses() });
export const getDressByIdThunk = createAsyncThunk('dresses/getById', async(id)=> { return await getDressById(id) });
export const getPopularDressesThunk = createAsyncThunk('dresses/getPopular', async()=> { return await getPopularDresses() });
export const addDressThunk = createAsyncThunk('dresses/addDress', async(dress)=> { return await addDress(dress) });
export const updateDressThunk = createAsyncThunk('dresses/update', async(dress)=> { return await updateDress(dress) });
export const deleteDressThunk = createAsyncThunk('dresses/delete', async(id)=> { return await deleteDress(id) });
export const addReviewThunk = createAsyncThunk('dresses/addReview', async(review)=> { return await addReview(review) });
export const getDressesByCategoryThunk = createAsyncThunk('categories/getDressesByCategory', async(id)=> { return await getDressesByCategory(id) });

const initialState=
{
    dresses: [],
    currentDress: null,
    favorites: [],
    popularDresses: [],
    popularStatus: 'idle',
    status: 'idle',
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
                state.status = 'loading';
            })
            .addCase(getAllDressesThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.dresses = action.payload;
            })
            .addCase(getAllDressesThunk.rejected, function(state) {
                state.status = 'failed';
            })

            .addCase(getDressByIdThunk.pending, function(state) {
                state.status = 'loading';
            })
            .addCase(getDressByIdThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentDress = action.payload;
            })
            .addCase(getDressByIdThunk.rejected, function(state) {
                state.status = 'failed';
            })

            .addCase(addDressThunk.pending, function(state) {
                state.status = 'loading';
            })
            .addCase(addDressThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.dresses.push(action.payload);
            })
            .addCase(addDressThunk.rejected, function(state) {
                state.status = 'failed';
            })

            .addCase(updateDressThunk.pending, function(state) {
                state.status = 'loading';
            })
            .addCase(updateDressThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedDress = action.payload; 
                const id = state.dresses.findIndex(d => d._id === updatedDress.id);
                if (id !== -1) {
                    state.dresses[id] = updatedDress;
                }
            })
            .addCase(updateDressThunk.rejected, function(state) {
                state.status = 'failed';
            })

            .addCase(deleteDressThunk.pending, function(state) {
                state.status = 'loading';
            })
            .addCase(deleteDressThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.dresses = state.dresses.filter(d => d._id !== action.payload);
            })

            .addCase(addReviewThunk.pending, function(state) {
                state.status = 'loading';
            })
            .addCase(addReviewThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const newReview = action.payload;
                if (state.currentDress) {
                    state.currentDress.reviews.push(newReview);
                }
            })
            .addCase(addReviewThunk.rejected, (state) => {
                state.status = 'failed';
            }) 

            .addCase(getDressesByCategoryThunk.pending, function(state) {
                state.status = 'loading'; 
            })
            .addCase(getDressesByCategoryThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.dresses = action.payload;
            })
            .addCase(getDressesByCategoryThunk.rejected, (state) => {
                state.status = 'failed';
            })

            .addCase(getPopularDressesThunk.pending, function(state) {
                state.popularStatus = 'loading';
            })
            .addCase(getPopularDressesThunk.fulfilled, (state, action) => {
                state.popularStatus = 'succeeded';
                state.popularDresses = action.payload;
            })
            .addCase(getPopularDressesThunk.rejected, function(state) {
                state.popularStatus = 'failed';
            })
        }
    }
)

export const {getAllFavorites, updateFavorites}=dressesSlice.actions;
export default dressesSlice.reducer;