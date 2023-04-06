import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import logger from 'redux-logger';
import {combineReducers} from '@reduxjs/toolkit';
import sounds from './Sounds';
import playlist from './Playlist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistApp = {
  key: 'app',
  storage: AsyncStorage,
  whilelist: ['playlist'],
};
const reducerCombined = combineReducers({
  sounds,
  playlist,
});
const store = configureStore({
  reducer: persistReducer(persistApp, reducerCombined),
  middleware: [logger],
});
export default store;
