import {createSlice} from '@reduxjs/toolkit';

export interface App {
  playlistCurrentIndex: number;
  init: number;
}
const initialState: App = {
  playlistCurrentIndex: 0,
  init: 0,
};

const AppSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    changeCurrentPlaylistIndex: (state, {payload}) => {
      return {...state, playlistCurrentIndex: payload.id};
    },
    setInitial: (state) => {
      return {...state, init: state.init + 1};
    },
  },
});
export const {changeCurrentPlaylistIndex, setInitial} = AppSlice.actions;
export default AppSlice.reducer;
