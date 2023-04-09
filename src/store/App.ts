import {createSlice} from '@reduxjs/toolkit';

export interface App {
  playlistCurrentIndex: number;
}
const initialState: App = {
  playlistCurrentIndex: 0,
};

const AppSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    changeCurrentPlaylistIndex: (state, {payload}) => {
      return {...state, playlistCurrentIndex: payload.id};
    },
  },
});
export const {changeCurrentPlaylistIndex} = AppSlice.actions;
export default AppSlice.reducer;
