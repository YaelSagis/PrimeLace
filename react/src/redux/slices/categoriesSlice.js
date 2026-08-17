import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addCategory, deleteCategory, getAllCategories, updateCategory } from "../../API/categoriesApi";

export const getAllCategoriesThunk = createAsyncThunk('categories/getAll', async () => { return await getAllCategories(); });
export const addCategoryThunk = createAsyncThunk('categories/add', async (category) => { return await addCategory(category); });
export const updateCategoryThunk = createAsyncThunk('categories/update', async ({ id, categoryData }) => { return await updateCategory(id, categoryData); });
export const deleteCategoryThunk = createAsyncThunk('categories/delete', async (id) => { return await deleteCategory(id); });

const initialState = {
    categories: [],       
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
    }
});

export default categoriesSlice.reducer;