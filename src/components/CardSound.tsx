import React, {useContext, useEffect, useRef, useState} from 'react';
import {fixUrlSound, pt} from '../Utils';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import * as images from '../assets';
import {Player} from '@react-native-community/audio-toolkit';
import {NavigationContext} from '@react-navigation/native';

const CardSound = ({props}: any) => {
  const navigation = useContext(NavigationContext);

  const [intenseIcon, setIntenseIcon] = useState(null);
  const [typeIcon, setTypeIcon] = useState(null);
  const [soundIsPlaying, setSoundPlaying] = useState(false);
  const [disable, setDisable] = useState(true);
  const playbackOptions = {
    continuesToPlayInBackground: false,
    mixWithOthers: false,
    autoDestroy: false,
    loop: false,
  };
  const sound = useRef(
    new Player(fixUrlSound(props.url), playbackOptions),
  ).current;

  const _playSound = () => {
    if (!sound.canPlay) return;
    if (sound.isPlaying) {
      sound.stop();
      setSoundPlaying(false);
    } else if (sound.isStopped) {
      sound.play();
      setSoundPlaying(true);
    }
  };

  useEffect(() => {
    sound.prepare(err => {
      if (!err) {
        setDisable(false);
        sound.looping = true;
      } else {
        setDisable(true);
      }
    });
    return () => sound.destroy();
  }, []);

  useEffect(() => {
    switch (parseInt(props.intense)) {
      case 1:
        setIntenseIcon(images.softIcon);
        break;
      case 2:
        setIntenseIcon(images.mediumIcon);
        break;
      case 3:
        setIntenseIcon(images.intenseIcon);
        break;
      default:
        break;
    }
    switch (parseInt(props.type)) {
      case 1:
        setTypeIcon(images.whisper);
        break;
      case 2:
        setTypeIcon(images.tap);
        break;
      case 3:
        setTypeIcon(images.scratch);
        break;
      case 4:
        setTypeIcon(images.rain);
        break;
      case 5:
        setTypeIcon(images.rust);
        break;
      case 6:
        setTypeIcon(images.mouth);
        break;
      case 7:
        setTypeIcon(images.message);
        break;
      case 8:
        setTypeIcon(images.brush);
        break;
      case 9:
        setTypeIcon(images.page);
        break;
      default:
        break;
    }
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.cardBox}>
        <View style={styles.col1}>
          <Text style={styles.genre}>{props.genre}</Text>
        </View>
        <View style={styles.row1}>
          <Text style={styles.title}>{props.name}</Text>
        </View>
        <View style={styles.row2}>
          {intenseIcon ? (
            <Image
              style={styles.typeImage}
              source={intenseIcon}
              resizeMode="contain"
            />
          ) : null}
          {typeIcon ? (
            <Image
              style={styles.typeImage}
              source={typeIcon}
              resizeMode="contain"
            />
          ) : null}
        </View>
      </View>
      <TouchableOpacity
        disabled={disable}
        style={[styles.play, {opacity: disable ? 0.5 : 1}]}
        onPress={_playSound}>
        <Image
          style={styles.button}
          source={soundIsPlaying ? images.pauseWhiteRound : images.playCard}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation?.navigate('Modal', {sound: props});
        }}
        style={styles.add}>
        <Image style={styles.button} source={images.addToPlaylist} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20 * pt,
    width: 140 * pt,
    height: 140 * pt,
    marginTop: 30 * pt,
  },
  typeImage: {
    width: 20 * pt,
    height: 20 * pt,
    marginHorizontal: 30 * pt,
    resizeMode: 'contain',
  },
  box: {
    backgroundColor: 'white',
    borderRadius: 30 * pt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 8 * pt,
  },
  cardBox: {
    width: 120 * pt,
    height: 120 * pt,
    borderColor: '#FF5757',
    borderWidth: 2 * pt,
    borderRadius: 10 * pt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row1: {
    flex: 2,
    justifyContent: 'center',
  },
  row2: {
    flex: 1,
    flexDirection: 'row',
    padding: 8 * pt,
  },
  col1: {
    flex: 1,
    justifyContent: 'center',
  },
  col2: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10 * pt,
  },
  genre: {
    color: 'gray',
    fontSize: 11 * pt,
    fontStyle: 'italic',
  },
  type: {
    color: '#FF5757',
    fontSize: 12 * pt,
    fontStyle: 'italic',
  },
  button: {
    width: 36 * pt,
    height: 36 * pt,
    borderRadius: 18 * pt,
  },
  play: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  add: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
export default CardSound;
