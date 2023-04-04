import React, {useContext} from 'react';
import AppNavigationContainer from './navigators';
import store from './store';
import {Provider} from 'react-redux';

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
        <AppNavigationContainer></AppNavigationContainer>
      </Provider>
    </AppContext.Provider>
  );
};
export default App;
