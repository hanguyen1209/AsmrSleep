import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Category, Home, Playlists} from '../screens';
import AddPlaylistModal from '../components/AddPlaylistModal';
const Stack = createNativeStackNavigator();

const Dark = {
  dark: true,
  colors: {
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(1, 1, 1)',
    card: 'rgb(18, 18, 18)',
    text: '#FF5757',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
  },
};
const AppNavigationContainer = () => {
  return (
    <NavigationContainer theme={Dark}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Group>
          <Stack.Screen name="Home" component={Home}></Stack.Screen>
          <Stack.Screen name="Playlist" component={Playlists}></Stack.Screen>
          <Stack.Screen name="Category" component={Category}></Stack.Screen>
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen
            options={{
              animation: 'fade_from_bottom',
              presentation: 'modal',
              contentStyle: {backgroundColor: 'transparent'}
            }}
            name="Modal"
            component={AddPlaylistModal}></Stack.Screen>
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export  default AppNavigationContainer