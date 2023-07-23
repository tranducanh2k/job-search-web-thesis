import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
    currentUser: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        login: (state, action) => {
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
        },
        checkCreatedEmployee: (state, action) => {
            state.currentUser.employeeId = action.payload;
        }
    }
});

export const {logout, login, checkCreatedEmployee} = authSlice.actions;

export default authSlice.reducer;