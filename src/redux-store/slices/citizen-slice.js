import { createSlice } from "@reduxjs/toolkit";

const CITIZEN_SLICE = createSlice({
    name: 'citizen',
    initialState: { citizen: null, filling: false },
    reducers: {
        setCitizen(state, action) {
            state.citizen = action.payload.citizen;
        },
        removeCitizen(state) {
            state.citizen = null;
        },
        updateAppliedFor(state, action) {
            state.citizen.appliedFor.push(action.payload.appliedFor)
        },
        setFilling(state, action) {
            state.filling = action.payload.filling;
        }
    }
});

export const CITIZEN_ACTIONS = CITIZEN_SLICE.actions;
export default CITIZEN_SLICE.reducer;