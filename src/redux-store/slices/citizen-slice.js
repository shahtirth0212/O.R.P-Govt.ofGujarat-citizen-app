import { createSlice } from "@reduxjs/toolkit";

const CITIZEN_SLICE = createSlice({
    name: 'citizen',
    initialState: { citizen: null, filling: false, socket: null, current: {} },
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
        },
        setSocket(state, action) {
            state.socket = action.payload.socket;
        },
        setCurrent(state, action) {
            state.current = action.payload.current;
        }
    }
});

export const CITIZEN_ACTIONS = CITIZEN_SLICE.actions;
export default CITIZEN_SLICE.reducer;