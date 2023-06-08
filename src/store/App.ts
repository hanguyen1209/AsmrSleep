import {createSlice} from '@reduxjs/toolkit';

export interface App {
  playlistCurrentIndex: number;
  init: number;
  agreedPolicy: boolean
}
const initialState: App = {
  playlistCurrentIndex: 0,
  init: 0,
  agreedPolicy: false
};

const AppSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    changeCurrentPlaylistIndex: (state, {payload}) => {
      return {...state, playlistCurrentIndex: payload.id};
    },
    setInitial: (state) => {
      return {...state, init: state.init > 2 ? 1 : state.init+ 1}; // refresh
    }
  },
});
export const {changeCurrentPlaylistIndex, setInitial} = AppSlice.actions;
export default AppSlice.reducer;
