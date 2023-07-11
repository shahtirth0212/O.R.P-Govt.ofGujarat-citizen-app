import { createSlice } from "@reduxjs/toolkit";

const CITIZEN_SLICE = createSlice({
    name: 'citizen',
    initialState: { citizen: null },
    reducers: {
        setCitizen(state, action) {
            state.citizen = action.payload.citizen;
        },
        removeCitizen(state) {
            state.citizen = null;
        }
    }
});

export const CITIZEN_ACTIONS = CITIZEN_SLICE.actions;
export default CITIZEN_SLICE.reducer;