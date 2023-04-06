import {createSlice} from '@reduxjs/toolkit';
import {Sound} from './Sounds';
const initialState: Array<Object> = [];

export interface Playlist {
  name: String;
  sounds: Array<Sound>;
}
interface PlaylistPayload {
  payload: Playlist;
}
const PlaylistSlice = createSlice({
  name: 'playlist',
  initialState: initialState,
  reducers: {
    addNewPlaylist: (state, {payload}: PlaylistPayload) => {
      if (!payload) return;
      const id = state.length + 1;
      const data = {
        id,
        name: payload.name,
        sounds: payload.sounds,
      };
      state.push(data);
    },
    addToOldPlaylist: (state, {payload}) => {
      if (!payload) return;
      const temp: any = Object.assign({}, state[payload.id]);
      temp.sounds.push(payload.sound);
      state.splice(payload.id, 1, temp);
    },
  },
});
export const {addNewPlaylist, addToOldPlaylist} = PlaylistSlice.actions;
export default PlaylistSlice.reducer;
