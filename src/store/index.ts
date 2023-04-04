import {configureStore} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {combineReducers} from '@reduxjs/toolkit';
import sounds from './Sounds';
import playlist from './Playlist';

const reducerCombined = combineReducers({sounds, playlist});
const store = configureStore({
  reducer: reducerCombined,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});
export default store;
