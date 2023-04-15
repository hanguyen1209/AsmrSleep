import {createSlice} from '@reduxjs/toolkit';
export interface Sound {
  url: string;
  online: Boolean;
  id: Number | null;
  volume: number;
  name: String;
}
const initialState = {};

const SoundSlice = createSlice({
  name: 'sounds',
  initialState: initialState,
  reducers: {
    addSound: (state, {payload}) => {
      return {...state, [payload.data._url]: payload.data};
    },
    resetSound: () => {
      return {};
    },
  },
});
export const {addSound, resetSound} = SoundSlice.actions;
export default SoundSlice.reducer;
