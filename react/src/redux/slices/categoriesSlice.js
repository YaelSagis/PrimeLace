import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addCategory, deleteCategory, getAllCategories, getLatestCategory, updateCategory } from "../../API/categoriesApi";

export const getAllCategoriesThunk = createAsyncThunk('categories/getAll', async () => { return await getAllCategories(); });
export const getLatestCategoryThunk = createAsyncThunk('categories/getLatest', async () => { return await getLatestCategory(); });
export const addCategoryThunk = createAsyncThunk('categories/add', async (category) => { return await addCategory(category); });
export const updateCategoryThunk = createAsyncThunk('categories/update', async ({ id, categoryData }) => { return await updateCategory(id, categoryData); });
export const deleteCategoryThunk = createAsyncThunk('categories/delete', async (id) => { return await deleteCategory(id); });

const initialState = {
    categories: [],
    latestCategory: null,
    latestStatus: 'idle',
    status: 'idle'
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategoriesThunk.pending, function(state) {
                state.status = 'loading';
            })
            .addCase(getAllCategoriesThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(getAllCategoriesThunk.rejected, (state) => {
                state.status = 'failed';
            }) 

            .addCase(addCategoryThunk.pending, function(state) {
                state.status = 'loading';
            })
            .addCase(addCategoryThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories.push(action.payload);
            })
            .addCase(addCategoryThunk.rejected, (state) => {
                state.status = 'failed';
            })

            .addCase(updateCategoryThunk.pending, function(state) {
                state.status = 'loading';
            })
            .addCase(updateCategoryThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { id, categoryData } = action.meta.arg;
                const index = state.categories.findIndex(c => c._id === id);
                if (index !== -1) {
                    state.categories[index] = { ...state.categories[index], ...categoryData };
                }
            })
            .addCase(updateCategoryThunk.rejected, (state) => {
                state.status = 'failed';
            })

            .addCase(deleteCategoryThunk.pending, function(state) {
                state.status = 'loading';
            })
            .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = state.categories.filter(c => c._id !== action.payload);
            })

            .addCase(getLatestCategoryThunk.pending, function(state) {
                state.latestStatus = 'loading';
            })
            .addCase(getLatestCategoryThunk.fulfilled, (state, action) => {
                state.latestStatus = 'succeeded';
                state.latestCategory = action.payload;
            })
            .addCase(getLatestCategoryThunk.rejected, function(state) {
                state.latestStatus = 'failed';
            })
    }
});

export default categoriesSlice.reducer;