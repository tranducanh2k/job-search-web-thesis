import { createSlice } from '@reduxjs/toolkit';

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
            state = initialState;
        }
    }
});

export const {logout, login} = authSlice.actions;

export default authSlice.reducer;