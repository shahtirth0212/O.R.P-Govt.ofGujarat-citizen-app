import { configureStore } from "@reduxjs/toolkit";
import CITIZEN_SLICE_REDUCER from './slices/citizen-slice';
import AUTH_SLICE_REDUCER from './slices/auth-slice';


const STORE = configureStore({
    reducer: {
        citizen: CITIZEN_SLICE_REDUCER,
        auth: AUTH_SLICE_REDUCER
    }
});


export default STORE;