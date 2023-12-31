import React, {useEffect, useRef, useState} from 'react';
import {NavigationContainer, createNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Category,
  Home,
  InitScreen,
  PlaylistDetail,
  Playlists,
  Settings,
} from '../screens';
import AddPlaylistModal from '../components/AddPlaylistModal';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
        initialRouteName="InitScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Group>
          <Stack.Screen name="InitScreen" component={InitScreen}></Stack.Screen>
          <Stack.Screen name="Home" component={Home}></Stack.Screen>
          <Stack.Screen name="Playlist" component={Playlists}></Stack.Screen>
          <Stack.Screen
            name="PlaylistDetail"
            component={PlaylistDetail}></Stack.Screen>
          <Stack.Screen name="Category" component={Category}></Stack.Screen>
          <Stack.Screen name="Settings" component={Settings}></Stack.Screen>
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen
            options={{
              animation: 'fade_from_bottom',
              presentation: 'modal',
              contentStyle: {
                backgroundColor: Platform.OS == 'ios' ? 'transparent' : '#000',
              },
            }}
            name="Modal"
            component={AddPlaylistModal}></Stack.Screen>
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigationContainer;
