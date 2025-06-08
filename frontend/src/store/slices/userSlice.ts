import {createSlice} from '@reduxjs/toolkit';

const initialState = {

    id: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {

            state.id = action.payload.id;
        },
        removeUser(state) {

            state.id = null;
        },
    },
});

export const {setUser, removeUser} = userSlice.actions;

export default userSlice.reducer;
