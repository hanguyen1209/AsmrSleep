import {createSlice} from '@reduxjs/toolkit';
import {Sound} from './Sounds';
const initialState: Array<Playlist> = [];

export interface Playlist {
  name: String;
  sounds: Array<Sound>;
  isMix: Boolean;
  isLoop: Boolean;
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
        isLoop: payload.isLoop,
        isMix: payload.isMix,
      };
      state.push(data);
    },
    addToOldPlaylist: (state, {payload}) => {
      if (!payload) return;
      const temp: any = Object.assign({}, state[payload.id]);
      temp.sounds.push(payload.sound);
      state.splice(payload.id, 1, temp);
    },
    deletePlaylist: (state, {payload}) => {
      state.splice(payload.id, 1);
    },
    updateIsMix: (state, {payload}) => {
      const temp: any = Object.assign({}, state[payload.id]);
      temp.isMix = !temp.isMix;
      state.splice(payload.id, 1, temp);
    },
    updateIsLoop: (state, {payload}) => {
      const temp: any = Object.assign({}, state[payload.id]);
      temp.isLoop = !temp.isLoop;
      state.splice(payload.id, 1, temp);
    },
    deleteSoundInPlaylist: (state, {payload}) => {
      const temp: Playlist = Object.assign({}, state[payload.id]);
      temp.sounds.splice(payload.soundId, 1);
      state.splice(payload.id, 1, temp);
    },
    adjustVolumnSound: (state, {payload}) => {
      const temp: Playlist = Object.assign({}, state[payload.id]);
      temp.sounds[payload.soundId].volume = payload.volume;
      state.splice(payload.id, 1, temp);
    },
    updateSoundDownloaded: (state, {payload}) => {
      const temp: Playlist = Object.assign({}, state[payload.id]);
      temp.sounds[payload.soundId].url = payload.url;
      temp.sounds[payload.soundId].online = false;
      state.splice(payload.id, 1, temp);
    },
  },
});
export const {
  addNewPlaylist,
  addToOldPlaylist,
  deletePlaylist,
  updateIsMix,
  updateIsLoop,
  deleteSoundInPlaylist,
  adjustVolumnSound,
  updateSoundDownloaded
} = PlaylistSlice.actions;
export default PlaylistSlice.reducer;
