import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {pt} from '../Utils';
import * as images from '../assets';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Player} from '@react-native-community/audio-toolkit';

const SoundBar = (props: any) => {
  const [icon, setIcon] = useState();
  const [isPlaying, setPlaying] = useState(false);
  const playbackOptions = {
    continuesToPlayInBackground: true,
    mixWithOthers: true,
    loop: true
  };
  const sound = useRef(new Player(props.url, playbackOptions)).current;
  const [disable, setDisable] = useState(true);
  const _playSound = () => {
    if (!sound.canPlay) return;
    if (isPlaying) {
      sound.pause();
      setPlaying(false);
    } else {
      sound.play();
      setPlaying(true);
    }
  };

  const _changeVolumn = (value: any) => {
    sound.volume = parseInt(value);
  };

  useEffect(() => {
    Icon.getImageSource('circle', 15, 'white').then(setIcon);
  }, []);

  useEffect(() => {
    sound.prepare(err => {
      if (!err) {
        sound.volume = parseInt(props.volumn);
        sound.looping = true;
        setDisable(false);
      } else {
        setDisable(true);
      }
    });
    return () => sound.destroy();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={disable ? styles.disable : styles.enable}
        disabled={disable}
        onPress={_playSound}>
        <Image
          style={styles.play}
          source={isPlaying ? images.playWhiteRound : images.pauseWhiteRound}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.main}>
        <View style={styles.above}>
          <Text style={styles.text1}>{props.name}</Text>
        </View>
        <View style={styles.below}>
          <Slider
            disabled={disable}
            style={{maxHeight: 20 * pt}}
            minimumValue={0}
            maximumValue={100}
            value={props.volumn}
            maximumTrackTintColor="#FFFFFF"
            minimumTrackTintColor={'#FF5757'}
            thumbImage={icon}
            onValueChange={_changeVolumn}
          />
          <Text style={styles.text2}>{props.id}</Text>
        </View>
      </View>
      <TouchableOpacity>
        <Image
          style={styles.remove}
          source={images.closeWhiteRound}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity disabled={disable}>
        <Image
          style={styles.download}
          source={images.downloadGray}
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
    paddingHorizontal: 10 * pt,
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
