import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {fixUrlSound, pt} from '../Utils';
import * as images from '../assets';
import {Player} from '@react-native-community/audio-toolkit';
const PlaylistSoundItem = (props: any) => {
  const [playState, setPlayState] = useState('pausing');
  const playbackOptions = {
    continuesToPlayInBackground: true,
    mixWithOthers: true,
    autoDestroy: false,
  };
  const player = useRef(
    new Player(fixUrlSound(props.url), playbackOptions),
  ).current;

  const _onPlaySound = () => {
    setPlayState('prepairing');
    if (player.canPlay || player.isPrepared) {
      player.playPause();
      setPlayState(player.isPlaying ? 'pausing' : 'playing');
    } else {
      player.prepare(() => {
        player.playPause();
        setPlayState(player.isPlaying ? 'pausing' : 'playing');
      });
    }
  };

  useEffect(() => {
    player.looping = true;
    return () => player.destroy();
  }, []);

  return (
    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
      {playState == 'prepairing' ? (
        <ActivityIndicator style={styles.image}></ActivityIndicator>
      ) : (
        <TouchableOpacity onPress={_onPlaySound}>
          <Image
            style={styles.image}
            source={
              playState == 'pausing' ? images.playMusic : images.pauseWhiteRound
            }
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      <Text style={styles.text}>{props.name}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 15 * pt,
    paddingHorizontal: 20 * pt,
  },
  image: {
    width: 30 * pt,
    height: 30 * pt,
    resizeMode: 'contain',
  },
});
export default PlaylistSoundItem;
