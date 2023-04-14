import {createSlice} from '@reduxjs/toolkit';
export interface Sound {
  url: String;
  online: Boolean;
  id: Number | null;
  volume: number;
  name: String
}
const initialState: any = [];

const SoundSlice = createSlice({
  name: 'sounds',
  initialState: initialState,
  reducers: {},
});
export default SoundSlice.reducer;
