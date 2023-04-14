import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fixUrlSound, pt} from '../Utils';
import * as images from '../assets';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Player} from '@react-native-community/audio-toolkit';
import {useDispatch, useSelector} from 'react-redux';
import {App, changeCurrentPlaylistIndex, setInitial} from '../store/App';
import {
  adjustVolumnSound,
  deletePlaylist,
  deleteSoundInPlaylist,
  Playlist as PlaylistType,
} from '../store/Playlist';

const SoundBar = (props: any) => {
  const [icon, setIcon] = useState();
  const dispatch = useDispatch();
  const playlist = useSelector(
    (store: {playlist: Array<PlaylistType>}) => store.playlist,
  );

  const playlistCurrentIndex = useSelector(
    (state: {app: App}) => state.app.playlistCurrentIndex,
  );
  const playbackOptions = {
    continuesToPlayInBackground: true,
    mixWithOthers: true,
    loop: true,
  };
  const sound = useRef(
    new Player(fixUrlSound(props.url), playbackOptions),
  ).current;
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    Icon.getImageSource('circle', 15, 'white').then(setIcon);
  }, []);

  useEffect(() => {
    sound.prepare(err => {
      if (!err) {
        sound.volume = parseInt(props.volume);
        // sound.looping = true;
        setDisable(false);
      } else {
        setDisable(true);
      }
    });
    return () => sound.destroy();
  }, []);

  const _removeSound = () => {
    if (playlist[playlistCurrentIndex].sounds.length == 1) {
      dispatch(deletePlaylist({id: playlistCurrentIndex}));
      dispatch(
        changeCurrentPlaylistIndex({
          id: playlistCurrentIndex > 0 ? playlistCurrentIndex - 1 : 0,
        }),
      );
    } else {
      dispatch(
        deleteSoundInPlaylist({
          id: playlistCurrentIndex,
          soundId: props.soundId,
        }),
      );
    }
    dispatch(setInitial());
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => _removeSound()}>
        <Image
          style={styles.remove}
          source={images.closeWhiteRound}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.main}>
        <View style={styles.above}>
          <View style={{flex: 1}}>
            <Text style={styles.text1}>{props.name}</Text>
          </View>
          <View style={{justifyContent: 'flex-end'}}>
            <Image
              style={{width: 20 * pt, height: 20 * pt, opacity: 0.7}}
              resizeMode="contain"
              source={images.volume}
            />
          </View>
        </View>
        <View style={styles.below}>
          <Slider
            disabled={disable}
            style={{maxHeight: 20 * pt}}
            minimumValue={0}
            maximumValue={1}
            value={props.volume}
            maximumTrackTintColor="#FFFFFF"
            minimumTrackTintColor={'#FF5757'}
            thumbImage={icon}
            onSlidingComplete={value => {
              dispatch(
                adjustVolumnSound({
                  id: playlistCurrentIndex,
                  soundId: props.soundId,
                  volume: value,
                }),
              );
              dispatch(setInitial());
            }}
          />
          <Text style={styles.text2}>ID: {props.id}</Text>
        </View>
      </View>

      <TouchableOpacity disabled={disable}>
        <Image
          style={styles.download}
          source={disable ? images.downloadGray : images.downloadWhite}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20 * pt,
  },
  play: {
    width: 30 * pt,
    height: 30 * pt,
  },
  remove: {
    width: 30 * pt,
    height: 30 * pt,
    marginLeft: 10 * pt,
  },
  download: {
    width: 30 * pt,
    height: 30 * pt,
    marginHorizontal: 20 * pt,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20 * pt,
    height: 35 * pt,
  },
  above: {
    flex: 1,
    flexDirection: 'row',
  },
  below: {
    height: 15 * pt,
  },
  text1: {
    fontWeight: 'bold',
    fontSize: 13 * pt,
    color: '#FF5757',
    flex: 1,
  },
  text2: {
    fontWeight: 'bold',
    fontSize: 10 * pt,
    color: 'gray',
  },
  disable: {
    opacity: 0.3,
  },
  enable: {
    opacity: 1,
  },
});
export default SoundBar;
