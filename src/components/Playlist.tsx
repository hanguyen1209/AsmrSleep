import React from 'react';
import {pt} from '../Utils';
import {Image, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import * as images from '../assets';

interface Playlist {
  isPlaying: boolean;
  text: string;
}

const Playlist = ({isPlaying, text}: Playlist) => {
  const choosePlaylist = (id: number) => {
    return () => {
      Alert.alert('ok')
    }
  }

  return (
    <TouchableOpacity onPress={choosePlaylist(123)} style={styles.container}>
      <TouchableOpacity style={{...styles.close, backgroundColor: isPlaying ? '#FF5757' : 'gray'}}>
        <Image
          source={images.closeWhite}
          resizeMode="contain"
          style={styles.x}
        />
      </TouchableOpacity>
      <Text style={{...styles.text, color: isPlaying ? '#FF5757' : 'gray'}}>{text}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20 * pt,
    alignItems: 'center',
    flexDirection: 'row',
    padding: 6 * pt,
    height: 30 * pt,
    marginHorizontal: 8 * pt,
  },
  close: {
    width: 20 * pt,
    height: 20 * pt,
    borderRadius: 10 * pt,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  x: {
    width: 11 * pt,
    height: 11 * pt,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 13 * pt,
    color: 'gray',
    paddingHorizontal: 10 * pt,
  },
});
export default Playlist;
