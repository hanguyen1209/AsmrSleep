import React from 'react';
import AppNavigationContainer from './navigators';
import store from './store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';

export const AppContext = React.createContext({});

interface Main {
  mainColor: String;
}
const App = () => {
  const value: Main = {
    mainColor: '#FF22DD',
  };
  return (
    <AppContext.Provider value={value}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistStore(store)}>
          <AppNavigationContainer></AppNavigationContainer>
        </PersistGate>
      </Provider>
    </AppContext.Provider>
  );
};
export default App;
