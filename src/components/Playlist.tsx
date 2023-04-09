import React from 'react';
import {pt} from '../Utils';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as images from '../assets';
import {useDispatch} from 'react-redux';
import {changeCurrentPlaylistIndex} from '../store/App';
import {deletePlaylist} from '../store/Playlist';

interface Playlist {
  isPlaying: boolean;
  text: String;
  id: number;
}

const Playlist = ({isPlaying, text, id}: Playlist) => {
  const dispatch = useDispatch();

  const choosePlaylist = (id: number) => {
    return () => dispatch(changeCurrentPlaylistIndex({id: id}));
  };

  const deleteAPlaylist = () =>
    Alert.alert(`Do you want to delete ${text} ?`, '', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          dispatch(deletePlaylist({id: id}));
        },
      },
    ]);

  return (
    <TouchableOpacity onPress={choosePlaylist(id)} style={styles.container}>
      <TouchableOpacity
        onPress={deleteAPlaylist}
        style={{
          ...styles.close,
          backgroundColor: isPlaying ? '#FF5757' : 'gray',
        }}>
        <Image
          source={images.closeWhite}
          resizeMode="contain"
          style={styles.x}
        />
      </TouchableOpacity>
      <Text style={{...styles.text, color: isPlaying ? '#FF5757' : 'gray'}}>
        {text}
      </Text>
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
