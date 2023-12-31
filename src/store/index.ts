import {configureStore} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import logger from 'redux-logger';
import {combineReducers} from '@reduxjs/toolkit';
import sounds from './Sounds';
import playlist from './Playlist';
import app from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistRoot = {
  key: 'root',
  storage: AsyncStorage,
  whilelist: ['playlist', 'app'],
  stateReconciler: autoMergeLevel2,
};
const persistApp = {
  key: 'app',
  storage: AsyncStorage,
  blacklist: ['init'],
};
const reducerCombined = combineReducers({
  sounds,
  playlist,
  app: persistReducer<ReturnType<typeof app>>(persistApp, app),
});
const store = configureStore({
  reducer: persistReducer<ReturnType<typeof reducerCombined>>(
    persistRoot,
    reducerCombined,
  ),
  middleware: [logger],
});
export default store;
