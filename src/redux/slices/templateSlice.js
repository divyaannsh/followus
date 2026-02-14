import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedTemplate: null,
};

const templateSlice = createSlice({
    name: "template",
    initialState,
    reducers: {
        setTemplate: (state, action) => {
            state.selectedTemplate = action.payload;
        },
    },
});

export const { setTemplate } = templateSlice.actions;
export default templateSlice.reducer;
